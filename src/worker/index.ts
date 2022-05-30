import {
  forceAddDirectory,
  removeDirectory,
  setQueue,
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
  if (data.message === 'setQueue') {
    return setQueue({ tracks: data.state });
  }
  if (data.message == 'setActiveTrack') {
    return setQueue({ activeTrackId: data.state });
  }
});
