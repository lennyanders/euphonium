import {
  MessageEventPostWorker,
  MessageEventPostFrontend,
} from '../../shared/workerCommunicationTypes';

export const worker = new Worker(new URL('../../worker', import.meta.url), { type: 'module' });

export const postMessage = (message: MessageEventPostFrontend['data']) =>
  worker.postMessage(message);

export const onMessage = (cb: (message: MessageEventPostWorker) => void) => {
  worker.addEventListener('message', cb);
  return () => worker.removeEventListener('message', cb);
};
