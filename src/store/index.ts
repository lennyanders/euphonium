import { createContext } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { onMessage, postMessage } from '../utils/worker';

export interface State {
  libraryDirectories: { id: number; name: string }[];
}

export const Store = createContext<State | null>(null);

export const useStore = () => {
  const [store, setStore] = useState<State | null>(null);
  useEffect(() => {
    postMessage({ message: 'getStore' });
    return onMessage(({ data }) => {
      if (data.message === 'setStore') return setStore(data.state);
      if (data.message === 'updateState') {
        setStore((state) => (state ? { ...state, ...data.state } : null));
      }
    });
  }, []);
  return store;
};
