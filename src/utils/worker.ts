import { workerPort } from '../workerPort';
import { Relation } from '../worker/track/getDirectoryRelation';
import type { WWME } from '../worker/utils';
import { State } from '../store';

export type WME<T extends string, U extends object = {}> = MessageEvent<U & { message: T }>;

export type MWME =
  | WME<'setStore', { state: State }>
  | WME<'updateState', { state: Partial<State> }>
  | WME<'tryAddDirectoryToLibrary', { relation: Relation }>;

export const postMessage = (message: WWME['data']) => {
  workerPort.postMessage(message);
};

export const onMessage = (cb: (message: MWME) => void) => {
  workerPort.addEventListener('message', cb);
  return () => workerPort.removeEventListener('message', cb);
};
