import { $, useComputed } from 'voby';
import { onMessage } from '../utils/worker';

export const tracks$ = $<FETrack[]>();
export const albums$ = $<FEAlbum[]>();
export const artists$ = $<FEArtist[]>();
export const libraryDirectories$ = $<FELibraryDirectory[]>();
export const loading$ = useComputed(
  () => !tracks$() || !albums$() || !artists$() || !libraryDirectories$(),
);

onMessage(({ data }) => {
  if (data.message === 'setTracks') return tracks$(data.state);
  if (data.message === 'setAlbums') return albums$(data.state);
  if (data.message === 'setArtists') return artists$(data.state);
  if (data.message === 'setLibraryDirectories') return libraryDirectories$(data.state);
});
