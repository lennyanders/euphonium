import $ from 'oby';
import { albumDataGetter, albumsGetter, artistsGetter, tracksGetter } from './computedValues';
import { postMessage, uw } from './utils';

export const partialUpdates$ = $(false);

export const state = $.store<State>({
  loading: false,
  trackData: {},
  get albumData() {
    return albumDataGetter.apply(this);
  },
  get tracks() {
    return tracksGetter.apply(this);
  },
  get albums() {
    return albumsGetter.apply(this);
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
  if (!state.tracks || !$.sample(partialUpdates$)) return;
  postMessage({ message: 'setTracks', state: uw(state).tracks! });
});

$.effect(() => {
  if (!state.albums || !$.sample(partialUpdates$)) return;
  postMessage({ message: 'setAlbums', state: uw(state).albums! });
});

$.effect(() => {
  if (!state.artists || !$.sample(partialUpdates$)) return;
  postMessage({ message: 'setArtists', state: uw(state).artists! });
});
