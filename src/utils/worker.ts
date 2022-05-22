import { worker } from '../shared';
import { Relation } from '../worker/files/getDirectoryRelation';
import type { WWME } from '../worker/utils';
import type { Library } from '../stores/library';

export type WME<T extends string, U extends object = {}> = MessageEvent<U & { message: T }>;

export type MWME =
  | WME<'setStore', { state: Library }>
  | WME<'requestPermission', { directoryHandle: FileSystemDirectoryHandle }>
  | WME<'updateState', { state: Partial<Library> }>
  | WME<'tryAddDirectoryToLibrary', { relation: Relation }>;

export const postMessage = (message: WWME['data']) => worker.postMessage(message);

export const onMessage = (cb: (message: MWME) => void) => {
  worker.addEventListener('message', cb);
  return () => worker.removeEventListener('message', cb);
};
