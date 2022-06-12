import $ from 'oby';
import { getFormattedTime } from '../shared/utils';
import { postMessage } from './utils';

export const libraryDirectories$ = $<FELibraryDirectory[]>();
export const queue$ = $<number[]>();
export const activeTrackId$ = $<number>();
export const tracks$ = $<FETrack[]>();
const albums$ = $.computed<FEAlbum[] | undefined>(() => {
  const tracks = tracks$();
  if (!tracks) return;
  if (!tracks.length) return [];

  const albumsObject: Record<string, Omit<FEAlbum, 'durationFormatted'>> = {};
  for (const track of tracks) {
    if (!track.albumTitle) continue;

    const key = `${track.albumArtist}${track.albumTitle}`;
    const albumObject = albumsObject[key];
    if (albumObject) {
      albumObject.duration += track.duration;
      albumObject.tracks.push(track);
      if (track.diskNumber && track.diskNumber > albumObject.diskCount) {
        albumObject.diskCount = track.diskNumber;
      }
    } else {
      albumsObject[key] = {
        title: track.albumTitle,
        artist: track.albumArtist || 'unknown artist',
        year: track.year,
        duration: track.duration,
        tracks: [track],
        diskCount: 1,
      };
    }
  }
  return Object.values(albumsObject)
    .sort((a, b) => a.title.localeCompare(b.title))
    .map<FEAlbum>((album) => {
      const sortedTracks = album.tracks
        .sort((a, b) => (a.number || 0) - (b.number || 0))
        .sort((a, b) => (a.diskNumber || 0) - (b.diskNumber || 0));

      let prevDiskNumber = 0;
      sortedTracks.forEach((track, index) => {
        if (track.diskNumber && prevDiskNumber !== track.diskNumber) {
          sortedTracks[index] = { ...track, showDiskNumber: true };
          prevDiskNumber = track.diskNumber;
        }
      });

      return {
        ...album,
        tracks: sortedTracks,
        durationFormatted: getFormattedTime(album.duration),
        cover: sortedTracks.find((track) => track.cover)?.cover,
      };
    });
});
const artists$ = $.computed<FEArtist[] | undefined>(() => {
  const tracks = tracks$();
  const albums = albums$();
  if (!tracks || !albums) return;
  if (!tracks.length) return [];

  const artists = [...new Set(tracks.map((track) => track.artist))].sort(
    (a, b) => (b && a?.localeCompare(b)) || 0,
  );
  return artists.map<FEArtist>((artist) => {
    const artistAlbums = albums
      .filter((album) => album.artist === artist)
      .sort((a, b) => (a.year || 0) - (b.year || 0));
    const singles = tracks.filter(
      (track) => track.albumArtist !== artist && track.artist === artist,
    );
    const duration = artistAlbums.reduce(
      (res, album) => res + album.duration,
      singles.reduce((res, track) => res + track.duration, 0),
    );
    return {
      name: artist || 'unknown artist',
      image:
        artistAlbums.find((album) => album.cover)?.cover ||
        singles.find((track) => track.cover)?.cover,
      albums: artistAlbums,
      singles,
      trackCount: artistAlbums.reduce((res, album) => res + album.tracks.length, singles.length),
      duration,
      durationFormatted: getFormattedTime(duration),
    };
  });
});

$.effect(() => {
  const state = libraryDirectories$();
  if (state) postMessage({ message: 'setLibraryDirectories', state });
});

$.effect(() => {
  const tracks = tracks$();
  if (tracks) postMessage({ message: 'setTracks', state: tracks });
});

$.effect(() => {
  const state = albums$();
  if (state) postMessage({ message: 'setAlbums', state });
});

$.effect(() => {
  const state = artists$();
  if (state) postMessage({ message: 'setArtists', state });
});

$.effect(() => {
  const activeTrackId = activeTrackId$();
  const queue = queue$();
  const tracks = $.sample(tracks$);
  if (typeof activeTrackId !== 'number' || !queue || !tracks) return;

  postMessage({
    message: 'setGeneralData',
    state: {
      queue: queue
        .map((id) => tracks.find((track) => track.id === id))
        .filter((track) => track) as FETrack[],
      activeTrackId,
    },
  });
});
