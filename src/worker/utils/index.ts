import { WME, MWME } from '../../utils/worker';
import { Relation } from '../track/getDirectoryRelation';

export type WWME =
  | WME<'getStore'>
  | WME<'removeLibraryDirectory', { id: number }>
  | WME<'tryAddDirectoryToLibrary', { directoryHandle: FileSystemDirectoryHandle }>
  | WME<
      'forceAddDirectoryToLibrary',
      { relation: Relation; directoryHandle: FileSystemDirectoryHandle }
    >;

export const postMessage = (message: MWME['data']) => {
  // @ts-ignore vite-plugin-checker does not know that this is in a worker
  globalThis.postMessage(message);
};

export const onMessage = (cb: (message: WWME) => void) => {
  globalThis.addEventListener('message', cb);
  return () => globalThis.removeEventListener('message', cb);
};
