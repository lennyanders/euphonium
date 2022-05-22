import { library } from '../stores/library';

let first = true;
export const requestFileAccess = async () => {
  let success = true;
  if (first) {
    const { libraryDirectories } = library();
    for (const directory of libraryDirectories) {
      success = (await directory.directoryHandle.requestPermission()) === 'granted';
    }
    first = false;
  }
  return success;
};
