import $ from 'oby';
import { postMessage } from './utils';

export const libraryDirectories$ = $<FELibraryDirectory[]>();
export const tracks$ = $<FETrack[]>();

const dispose = $.effect(() => {
  const libraryDirectories = libraryDirectories$();
  const tracks = tracks$();
  if (!tracks || !libraryDirectories) return;

  postMessage({ message: 'setStore', state: { libraryDirectories, tracks, albums: [] } });
  dispose();

  $.effect(() => {
    postMessage({ message: 'updateState', state: { libraryDirectories: libraryDirectories$() } });
  });
  $.effect(() => {
    postMessage({ message: 'updateState', state: { tracks: tracks$() } });
  });
});
