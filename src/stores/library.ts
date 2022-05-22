import { $ } from 'voby';
import { onMessage } from '../utils/worker';
import { DbTrack } from '../worker/database';

export interface Library {
  libraryDirectories: { id: number; name: string; directoryHandle: FileSystemDirectoryHandle }[];
  tracks: DbTrack[];
}

export const library = $<Library>({ libraryDirectories: [], tracks: [] });
export const loading = $(true);

onMessage(({ data }) => {
  if (data.message === 'setStore') {
    library(data.state);
    loading(false);
  } else if (data.message === 'updateState') {
    library((state) => ({ ...state, ...data.state }));
  }
});
