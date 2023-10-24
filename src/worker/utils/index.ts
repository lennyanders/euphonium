import {
  MessageEventPostWorker,
  MessageEventPostFrontend,
} from '../../shared/workerCommunicationTypes';

export const postMessage = (message: MessageEventPostWorker['data']) => {
  // @ts-ignore vite-plugin-checker does not know that this is in a worker
  globalThis.postMessage(message);
};

export const onMessage = (cb: (message: MessageEventPostFrontend) => void) => {
  globalThis.addEventListener('message', cb);
  return () => globalThis.removeEventListener('message', cb);
};
