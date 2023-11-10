import {
  MessageEventPostWorker,
  MessageEventPostFrontend,
} from '../../shared/workerCommunicationTypes';

export const ports: MessagePort[] = [];

export const postMessageGlobal = (message: MessageEventPostWorker['data']) => {
  // @ts-ignore vite-plugin-checker does not know that this is in a worker
  ports.forEach((port) => port.postMessage(message));
};

export const postMessage = (port: MessagePort, message: MessageEventPostWorker['data']) => {
  port.postMessage(message);
};

type MessageHandler = (message: MessageEventPostFrontend, port: MessagePort) => void;
const messageHandlers: MessageHandler[] = [];
export const onMessage = (cb: MessageHandler) => messageHandlers.push(cb);

type ConnectHandler = (port: MessagePort) => void;
const connectHandlers: ConnectHandler[] = [];
export const onConnect = (cb: ConnectHandler) => connectHandlers.push(cb);

globalThis.addEventListener('connect', (event) => {
  const port = event.ports[0];
  ports.push(port);

  connectHandlers.forEach((connectHandler) => connectHandler(port));

  port.addEventListener('message', (event) => {
    messageHandlers.forEach((messageHandler) => messageHandler(event, port));
  });

  port.start();
});

export const clone = <T>(obj: T): T => {
  if (typeof obj !== 'object' || obj instanceof FileSystemHandle) return obj;

  if (Array.isArray(obj)) return obj.map((v: any) => clone(v)) as T;

  const res = {} as T;
  for (const key in obj) res[key] = clone(obj[key]);
  return res;
};
