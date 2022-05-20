import { Library } from '../stores/library';
import { getDirectories, getTracks } from './library';
import { postMessage } from './utils';

export const getStore = async () => {
  const state: Library = {
    libraryDirectories: await getDirectories(),
    tracks: await getTracks(),
  };

  postMessage({ message: 'setStore', state });
};
