import { libraryDirectories$ } from '../stores/library';

let first = true;
export const requestFileAccess = async () => {
  let success = true;
  if (first) {
    const libraryDirectories = libraryDirectories$();
    if (!libraryDirectories?.length) return success;
    for (const directory of libraryDirectories) {
      success = (await directory.directoryHandle.requestPermission()) === 'granted';
    }
    first = false;
  }
  return success;
};
