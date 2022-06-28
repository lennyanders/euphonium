import { getFormattedTime } from '../shared/utils';

export function albumDataGetter(this: State) {
  const albumsObject: Record<string, Omit<FEAlbum, 'durationFormatted' | 'showDiskOnTracks'>> = {};
  for (const trackId in this.trackData) {
    const track = this.trackData[trackId];
    if (!track.albumTitle) continue;

    const key = `${track.albumArtist}${track.albumTitle}`;
    const albumObject = albumsObject[key];
    if (albumObject) {
      albumObject.duration += track.duration;
      albumObject.tracks.push(track.id);
      if (track.diskNumber && track.diskNumber > albumObject.diskCount) {
        albumObject.diskCount = track.diskNumber;
      }
    } else {
      albumsObject[key] = {
        title: track.albumTitle,
        artist: track.albumArtist || 'unknown artist',
        year: track.year,
        duration: track.duration,
        tracks: [track.id],
        diskCount: 1,
      };
    }
  }
  const finalAlbumsObject: Record<string, FEAlbum> = {};
  for (const key in albumsObject) {
    const album = albumsObject[key];
    const sortedTracks = album.tracks
      .map((track) => this.trackData[track])
      .sort((a, b) => (a.number || 0) - (b.number || 0))
      .sort((a, b) => (a.diskNumber || 0) - (b.diskNumber || 0));

    const showDiskOnTracks: number[] = [];
    let prevDiskNumber = 0;
    for (const track of sortedTracks) {
      if (track.diskNumber && prevDiskNumber !== track.diskNumber) {
        showDiskOnTracks.push(track.id);
        prevDiskNumber = track.diskNumber;
      }
    }

    finalAlbumsObject[key] = {
      ...album,
      tracks: sortedTracks.map((track) => track.id),
      showDiskOnTracks,
      durationFormatted: getFormattedTime(album.duration),
      cover: sortedTracks.find((track) => track.cover)?.cover,
    };
  }
  return finalAlbumsObject;
}

export function albumsGetter(this: State) {
  return Object.values(this.albumData)
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((album) => `${album.artist}${album.title}`);
}

export function artistsGetter(this: State) {
  const tracks = Object.values(this.trackData);
  const albums = Object.values(this.albumData);
  if (!tracks.length) return [];

  const artists = [...new Set(tracks.map((track) => track.artist))].sort(
    (a, b) => (b && a?.localeCompare(b)) || 0,
  );
  return artists.map<FEArtist>((artist) => {
    const artistAlbums = albums
      .filter((album) => album.artist === artist)
      .sort((a, b) => (a.year || 0) - (b.year || 0));
    const sortedSingles = tracks
      .filter((track) => track.albumArtist !== artist && track.artist === artist)
      .sort((a, b) => (a.number || 0) - (b.number || 0))
      .sort((a, b) => (a.diskNumber || 0) - (b.diskNumber || 0));
    const singles = sortedSingles.map((track) => track.id);

    const duration = artistAlbums.reduce(
      (res, album) => res + album.duration,
      sortedSingles.reduce((res, track) => res + track.duration, 0),
    );
    return {
      name: artist || 'unknown artist',
      image:
        artistAlbums.find((album) => album.cover)?.cover ||
        sortedSingles.find((track) => track.cover)?.cover,
      albums: artistAlbums.map((album) => `${album.artist}${album.title}`),
      singles,
      tracks: artistAlbums
        .reduce<number[]>((res, album) => res.concat(album.tracks), [])
        .concat(singles),
      duration,
      durationFormatted: getFormattedTime(duration),
    };
  });
}
