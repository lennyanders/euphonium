import { useBatch, store } from 'voby';
import { onMessage } from '../utils/worker';

export const state = store<FEState>({ loading: true });

onMessage(({ data }) => {
  if (data.message === 'setState') return useBatch(() => Object.assign(state, data.state));
  if (data.message === 'setTracks') return (state.tracks = data.state);
  if (data.message === 'setAlbums') return (state.albums = data.state);
  if (data.message === 'setArtists') return (state.artists = data.state);
  if (data.message === 'setLibraryDirectories') return (state.libraryDirectories = data.state);
  if (data.message === 'setGeneralData') return useBatch(() => Object.assign(state, data.state));
});
