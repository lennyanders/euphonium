import { MWME, WWME } from '../shared/workerFeCommunicationTypes';
import MyWorker from '../worker?worker';

export const worker = new MyWorker();

export const postMessage = (message: WWME['data']) => worker.postMessage(message);

export const onMessage = (cb: (message: MWME) => void) => {
  worker.addEventListener('message', cb);
  return () => worker.removeEventListener('message', cb);
};
