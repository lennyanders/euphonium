import { $, useComputed } from 'voby';
import { onMessage } from '../utils/worker';
import { currentTrackId$, queue$ } from './player';

export const tracks$ = $<FETrack[]>();
export const albums$ = $<FEAlbum[]>();
export const artists$ = $<FEArtist[]>();
export const libraryDirectories$ = $<FELibraryDirectory[]>();
export const loading$ = useComputed(
  () => !tracks$() || !albums$() || !artists$() || !libraryDirectories$(),
);

onMessage(({ data }) => {
  if (data.message === 'setTracks') {
    if (!queue$()) queue$(data.state), currentTrackId$(data.state[0].id);
    return tracks$(data.state);
  }
  if (data.message === 'setAlbums') return albums$(data.state);
  if (data.message === 'setArtists') return artists$(data.state);
  if (data.message === 'setLibraryDirectories') return libraryDirectories$(data.state);
});
