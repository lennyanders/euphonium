import { State } from '../store';
import { getDirectories, getTracks } from './library';
import { postMessage } from './utils';

export const getStore = async () => {
  const state: State = {
    libraryDirectories: await getDirectories(),
    tracks: await getTracks(),
  };

  postMessage({ message: 'setStore', state });
};
