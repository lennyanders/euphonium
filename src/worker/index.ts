import {
  forceAddDirectory,
  removeDirectory,
  setGeneralData,
  setTemporaryData,
  tryAddDirectory,
  updateFiles,
} from './library';
import { onMessage, ports, postMessage, postMessageGlobal } from './utils';

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

onMessage(({ data }, onMessagePort) => {
  if (data.message === 'play') {
    for (const port of ports) {
      if (port === onMessagePort) postMessage(port, data);
      else postMessage(port, { message: 'pause' });
    }
    return;
  }
  if (data.message === 'pause') {
    return postMessageGlobal(data);
  }
});
