import {
  MessageEventPostWorker,
  MessageEventPostFrontend,
} from '../../shared/workerCommunicationTypes';

export const worker = new SharedWorker(new URL('../../worker', import.meta.url), {
  type: 'module',
});

worker.port.start();

export const postMessage = (message: MessageEventPostFrontend['data']) => {
  if (import.meta.env.DEV) console.log('frontend post message: ', message);
  worker.port.postMessage(message);
};

let first = true;
export const onMessage = (cb: (message: MessageEventPostWorker) => void) => {
  const log = import.meta.env.DEV && first;
  if (first) first = false;
  const newCb = (message: MessageEventPostWorker) => {
    if (log) console.log('frontend on message: ', message.data);
    cb(message);
  };
  worker.port.addEventListener('message', newCb);
  return () => worker.port.removeEventListener('message', newCb);
};
