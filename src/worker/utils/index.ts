import $ from 'oby';

import { MWME, WWME } from '../../shared/workerFeCommunicationTypes';

export const postMessage = (message: MWME['data']) => {
  // @ts-ignore vite-plugin-checker does not know that this is in a worker
  globalThis.postMessage(message);
};

export const onMessage = (cb: (message: WWME) => void) => {
  globalThis.addEventListener('message', cb);
  return () => globalThis.removeEventListener('message', cb);
};

export const uw = <T>(v: T) => $.store(v, { unwrap: true });
