import { store, $, $$, untrack, useAnimationFrame, useEffect } from 'voby';

import { state } from '../modules/library';

let first = true;
export const requestFileAccess = async () => {
  let success = true;
  if (first) {
    const { libraryDirectories } = state;
    if (!libraryDirectories?.length) return success;
    for (const directory of libraryDirectories) {
      success = (await directory.directoryHandle.requestPermission()) === 'granted';
    }
    first = false;
  }
  return success;
};

export const getShuffledQueue = () => {
  const tracks = [...(store.unwrap(state).originalQueue || [])];
  let currentIndex = tracks.length;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [tracks[currentIndex], tracks[randomIndex]] = [tracks[randomIndex], tracks[currentIndex]];
  }

  const activeTrackIndex = tracks.indexOf(state.activeTrackId || -1);
  if (activeTrackIndex > -1) {
    [tracks[0], tracks[activeTrackIndex]] = [tracks[activeTrackIndex], tracks[0]];
  }

  return tracks;
};

export const insertAfterValInArr = (arr: number[], val: number, reference: number) => {
  const newArr = arr.slice().filter((v) => v !== val);
  const index = newArr.indexOf(reference);
  if (index > -1) newArr.splice(index + 1, 0, val);
  else newArr.push(val);
  return newArr;
};

export const appendToArrayUnique = (arr: number[], val: number) => {
  const newArr = arr.slice().filter((v) => v !== val);
  newArr.push(val);
  return newArr;
};

export const useDebouncedMemo = <T extends any>(val: () => T) => {
  const val$ = $<T>(untrack(val));
  useEffect(() => {
    $$(val);
    useAnimationFrame(() => val$($$(val)));
  });
  return val$;
};
