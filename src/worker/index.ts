import { forceAddDirectory, removeDirectory, tryAddDirectory } from './library';
import { ports } from './shared';
import { getStore } from './store';
import { onMessage } from './utils';

globalThis.addEventListener('connect', (event) => {
  const [port] = (event as any as { ports: MessagePort[] }).ports;
  port.start();
  ports.push(port);

  onMessage(port, async ({ data }) => {
    if (data.message === 'getStore') {
      return getStore();
    }
    if (data.message === 'removeLibraryDirectory') {
      return removeDirectory(data.id);
    }
    if (data.message === 'tryAddDirectoryToLibrary') {
      return tryAddDirectory(data.directoryHandle);
    }
    if (data.message === 'forceAddDirectoryToLibrary') {
      return forceAddDirectory(data.relation, data.directoryHandle);
    }
  });
});
