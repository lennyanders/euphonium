import { getFormattedTime } from '../shared/utils';

export function albumDataGetter(this: State) {
  const albumsObject: Record<string, Omit<FeAlbum, 'durationFormatted' | 'showDiskOnTracks'>> = {};
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
  const finalAlbumsObject: Record<string, FeAlbum> = {};
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
      images: sortedTracks.find((track) => track.images)?.images,
    };
  }
  return finalAlbumsObject;
}

export function artistDataGetter(this: State) {
  const tracks = Object.values(this.trackData);
  const albums = Object.values(this.albumData);
  if (!tracks.length) return {};

  const artists = [...new Set(tracks.map((track) => track.artist || 'unknown artist'))];
  const artistObject: Record<string, FeArtist> = {};
  for (const artist of artists) {
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
    artistObject[artist] = {
      name: artist,
      images:
        artistAlbums.find((album) => album.images)?.images ||
        sortedSingles.find((track) => track.images)?.images,
      albums: artistAlbums.map((album) => `${album.artist}${album.title}`),
      singles,
      tracks: artistAlbums
        .reduce<number[]>((res, album) => res.concat(album.tracks), [])
        .concat(singles),
      duration,
      durationFormatted: getFormattedTime(duration),
    };
  }
  return artistObject;
}
