import $ from 'oby';
import { albumDataGetter, artistsGetter } from './computedValues';
import { postMessage, uw } from './utils';

export const partialUpdates$ = $(false);

export const state = $.store<State>({
  loading: false,
  trackData: {},
  get albumData() {
    return albumDataGetter.apply(this);
  },
  get artists() {
    return artistsGetter.apply(this);
  },
});

$.effect(() => {
  if (!state.libraryDirectories || !$.sample(partialUpdates$)) return;
  postMessage({ message: 'setLibraryDirectories', state: uw(state).libraryDirectories! });
});

$.effect(() => {
  if (!state.trackData || !$.sample(partialUpdates$)) return;
  postMessage({ message: 'setTrackData', state: uw(state).trackData! });
});

$.effect(() => {
  if (!state.albumData || !$.sample(partialUpdates$)) return;
  postMessage({ message: 'setAlbumData', state: uw(state).albumData! });
});

$.effect(() => {
  if (!state.artists || !$.sample(partialUpdates$)) return;
  postMessage({ message: 'setArtists', state: uw(state).artists! });
});
