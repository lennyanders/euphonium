import { $ } from 'voby';
import { onMessage, postMessage } from '../utils/worker';
import { Track } from '../worker/database';

export interface Library {
  libraryDirectories: { id: number; name: string; directoryHandle: FileSystemDirectoryHandle }[];
  tracks: Track[];
}

export const library = $<Library>({ libraryDirectories: [], tracks: [] });

postMessage({ message: 'getStore' });
onMessage(({ data }) => {
  if (data.message === 'setStore') return library(data.state);
  if (data.message === 'updateState') library((state) => ({ ...state, ...data.state }));
});
