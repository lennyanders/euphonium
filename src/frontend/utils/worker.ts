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

export const onMessage = (cb: (message: MessageEventPostWorker) => void) => {
  const newCb = (message: MessageEventPostWorker) => {
    if (import.meta.env.DEV) console.log('frontend on message: ', message);
    cb(message);
  };
  worker.port.addEventListener('message', newCb);
  return () => worker.port.removeEventListener('message', newCb);
};
