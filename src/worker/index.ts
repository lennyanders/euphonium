import { forceAddDirectory, removeDirectory, tryAddDirectory, updateFiles } from './library';
import { getStore } from './store';
import { onMessage } from './utils';

getStore();

onMessage(async ({ data }) => {
  if (data.message == 'reloadLibrary') {
    return updateFiles();
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
