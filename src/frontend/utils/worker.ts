import { MWME, WWME } from '../../shared/workerFeCommunicationTypes';

export const worker = new Worker(new URL('../../worker', import.meta.url), { type: 'module' });

export const postMessage = (message: WWME['data']) => worker.postMessage(message);

export const onMessage = (cb: (message: MWME) => void) => {
  worker.addEventListener('message', cb);
  return () => worker.removeEventListener('message', cb);
};
