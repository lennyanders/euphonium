import { useBatch, store } from 'voby';
import { onMessage } from '../utils/worker';

export type Store = Partial<
  {
    libraryDirectories: FELibraryDirectory[];
    tracks: FETrack[];
    albums: FEAlbum[];
    artists: FEArtist[];
    loading: boolean;
  } & FEGeneralData
>;

export const state = store<Store>({
  get loading() {
    return !this.tracks || !this.albums || !this.artists || !this.libraryDirectories;
  },
});

onMessage(({ data }) => {
  if (data.message === 'setTracks') return (state.tracks = data.state);
  if (data.message === 'setAlbums') return (state.albums = data.state);
  if (data.message === 'setArtists') return (state.artists = data.state);
  if (data.message === 'setLibraryDirectories') return (state.libraryDirectories = data.state);
  if (data.message === 'setGeneralData') return useBatch(() => Object.assign(state, data.state));
});
