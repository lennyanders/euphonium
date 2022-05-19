import { $ } from 'voby';
import { onMessage, postMessage } from '../utils/worker';
import { Track } from '../worker/database';

export interface State {
  libraryDirectories: { id: number; name: string }[];
  tracks: Track[];
}

export const store = $<State>({ libraryDirectories: [], tracks: [] });

postMessage({ message: 'getStore' });
onMessage(({ data }) => {
  if (data.message === 'setStore') return store(data.state);
  if (data.message === 'updateState') store((state) => ({ ...state, ...data.state }));
});
