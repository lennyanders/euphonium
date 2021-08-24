import { forceAddDirectory, removeDirectory, tryAddDirectory } from './library';
import { getStore } from './store';
import { onMessage } from './utils';

onMessage(async ({ data }) => {
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
