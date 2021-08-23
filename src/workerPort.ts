import IdbWorker from './worker?sharedworker';

const worker = new IdbWorker();
const workerPort = worker.port;
workerPort.start();
export { workerPort };
