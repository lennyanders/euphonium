import { Library } from '../stores/library';
import { beToFETrack } from './files/coverters';
import { getDirectories, getTracks } from './library';
import { postMessage } from './utils';

export const getStore = async () => {
  const state: Library = {
    libraryDirectories: await getDirectories(),
    tracks: (await getTracks()).map(beToFETrack),
  };

  postMessage({ message: 'setStore', state });
};
