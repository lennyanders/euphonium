import {
  MessageEventPostWorker,
  MessageEventPostFrontend,
} from '../../shared/workerCommunicationTypes';

export const worker = new SharedWorker(new URL('../../worker', import.meta.url), {
  type: 'module',
});

worker.port.start();

export const postMessage = (message: MessageEventPostFrontend['data']) =>
  worker.port.postMessage(message);

export const onMessage = (cb: (message: MessageEventPostWorker) => void) => {
  worker.port.addEventListener('message', cb);
  return () => worker.port.removeEventListener('message', cb);
};
