import { store } from 'voby';
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

export const uw = <T>(v: T) => store(v, { unwrap: true });

export const getShuffledQueue = () => {
  const tracks = [...(uw(state).queue || [])];
  let currentIndex = tracks.length;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [tracks[currentIndex], tracks[randomIndex]] = [tracks[randomIndex], tracks[currentIndex]];
  }

  const { activeTrackId } = uw(state);
  const activeTrackIndex = tracks.findIndex((track) => track.id === activeTrackId);
  if (activeTrackIndex) {
    [tracks[0], tracks[activeTrackIndex]] = [tracks[activeTrackIndex], tracks[0]];
  }

  return tracks;
};
