import { State } from '../store';
import { getDirectories } from './library';
import { postMessage } from './utils';

export const getStore = async () => {
  const state: State = {
    libraryDirectories: await getDirectories(),
  };

  postMessage({ message: 'setStore', state });
};
