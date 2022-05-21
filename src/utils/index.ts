import { library } from '../stores/library';

const pad = (number: number) => number.toString().padStart(2, '0');

export const getFormattedTime = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours ? `${hours}:` : ''}${hours ? pad(minutes) : minutes}:${pad(seconds)}`;
};

export type Props<T extends EventTarget, U> = JSX.DOMAttributes<T> &
  JSX.HTMLAttributes<T> &
  JSX.ClassAttributes<T> &
  U;

let first = true;
export const requestFileAccess = async () => {
  if (first) {
    const { libraryDirectories } = library();
    for (const directory of libraryDirectories) {
      await directory.directoryHandle.requestPermission();
    }
    first = false;
  }
};
