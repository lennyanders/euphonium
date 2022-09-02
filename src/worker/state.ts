import $ from 'oby';

import { albumDataGetter, artistDataGetter } from './computedValues';
import { postMessage, uw } from './utils';

export const partialUpdates$ = $(false);

export const state = $.store<State>({
  loading: false,
  trackData: {},
  get albumData() {
    return albumDataGetter.apply(this);
  },
  get artistData() {
    return artistDataGetter.apply(this);
  },
});

$.effect(() => {
  if (!state.libraryDirectories || !$.untrack(partialUpdates$)) return;
  postMessage({ message: 'setLibraryDirectories', state: uw(state).libraryDirectories! });
});

$.effect(() => {
  if (!state.trackData || !$.untrack(partialUpdates$)) return;
  postMessage({ message: 'setTrackData', state: uw(state).trackData! });
});

$.effect(() => {
  if (!state.albumData || !$.untrack(partialUpdates$)) return;
  postMessage({ message: 'setAlbumData', state: uw(state).albumData! });
});

$.effect(() => {
  if (!state.artistData || !$.untrack(partialUpdates$)) return;
  postMessage({ message: 'setArtistData', state: uw(state).artistData! });
});
