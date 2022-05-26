import { $ } from 'voby';
import { onMessage } from '../utils/worker';

export const library = $<Library>({ libraryDirectories: [], tracks: [], albums: [], artists: [] });
export const loading = $(true);

onMessage(({ data }) => {
  if (data.message === 'setStore') {
    library(data.state);
    loading(false);
  } else if (data.message === 'updateState') {
    library((state) => ({ ...state, ...data.state }));
  }
});
