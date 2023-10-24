import {
  MessageEventPostWorker,
  MessageEventPostFrontend,
} from '../../shared/workerCommunicationTypes';

const ports: MessagePort[] = [];

export const postMessageGlobal = (message: MessageEventPostWorker['data']) => {
  // @ts-ignore vite-plugin-checker does not know that this is in a worker
  ports.forEach((port) => port.postMessage(message));
};

export const postMessage = (port: MessagePort, message: MessageEventPostWorker['data']) => {
  port.postMessage(message);
};

type MessageHandler = (message: MessageEventPostFrontend) => void;
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
    messageHandlers.forEach((messageHandler) => messageHandler(event));
  });

  port.start();
});
