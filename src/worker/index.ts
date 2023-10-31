import {
  forceAddDirectory,
  removeDirectory,
  setGeneralData,
  setTemporaryData,
  tryAddDirectory,
  updateFiles,
} from './library';
import { onMessage } from './utils';

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
  if (data.message === 'setGeneralData') {
    return setGeneralData(data.state);
  }
  if (data.message === 'setTemporaryData') {
    return setTemporaryData(data.state);
  }
});
