import { getFEDirectories, getFETracks } from './library';
import { postMessage } from './utils';

export const getStore = async () => {
  const state: Library = {
    libraryDirectories: await getFEDirectories(),
    tracks: await getFETracks(),
    albums: [],
  };

  postMessage({ message: 'setStore', state });
};
