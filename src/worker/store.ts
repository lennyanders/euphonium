import $ from 'oby';
import { getFormattedTime } from '../shared/utils';
import { postMessage } from './utils';

export const libraryDirectories$ = $<FELibraryDirectory[]>();
export const tracks$ = $<FETrack[]>();
export const albums$ = $.computed<FEAlbum[] | undefined>(() => {
  const tracks = tracks$();
  if (!tracks?.length) return;

  const albumsObject: Record<
    string,
    Omit<FEAlbum, 'durationFormatted' | 'tracks'> & { duration: number; tracks: FETrack[] }
  > = {};
  for (const track of tracks) {
    if (!track.albumTitle) continue;

    const key = `${track.albumArtist}${track.albumTitle}${track.year}`;
    const albumObject = albumsObject[key];
    if (albumObject) {
      albumObject.duration += track.duration;
      albumObject.tracks.push(track);
      if (track.diskCount && track.diskCount > albumObject.diskCount) {
        albumObject.diskCount = track.diskCount;
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
  return Object.values(albumsObject).map<FEAlbum>((album) => {
    const sortedTracks = album.tracks
      .sort((a, b) => (a.number || 0) - (b.number || 0))
      .sort((a, b) => (a.diskNumber || 0) - (b.diskNumber || 0));
    return {
      ...album,
      tracks: sortedTracks.map((track) => track.id!),
      durationFormatted: getFormattedTime(album.duration),
      cover: sortedTracks.find((track) => track.cover)?.cover,
    };
  });
});

const dispose = $.effect(() => {
  const libraryDirectories = libraryDirectories$();
  const tracks = tracks$();
  const albums = albums$();
  if (!tracks || !libraryDirectories || !albums) return;

  postMessage({ message: 'setStore', state: { libraryDirectories, tracks, albums: [] } });
  dispose();

  $.effect(() => {
    postMessage({ message: 'updateState', state: { libraryDirectories: libraryDirectories$() } });
  });
  $.effect(() => {
    postMessage({ message: 'updateState', state: { tracks: tracks$() } });
  });
  $.effect(() => {
    postMessage({ message: 'updateState', state: { albums: albums$() } });
  });
});
