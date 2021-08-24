import { WME, MWME } from '../../utils/worker';
import { Relation } from '../track/getDirectoryRelation';
import { ports } from '../shared';

export type WWME =
  | WME<'getStore'>
  | WME<'removeLibraryDirectory', { id: number }>
  | WME<'tryAddDirectoryToLibrary', { directoryHandle: FileSystemDirectoryHandle }>
  | WME<
      'forceAddDirectoryToLibrary',
      { relation: Relation; directoryHandle: FileSystemDirectoryHandle }
    >;

export const onMessage = (port: MessagePort, cb: (message: WWME) => void) => {
  port.addEventListener('message', cb);
  return () => port.removeEventListener('message', cb);
};

export const postMessage = (message: MWME['data']) => {
  for (const port of ports) port.postMessage(message);
};
