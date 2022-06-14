import $ from 'oby';
import { albumsGetter, artistsGetter } from './computedValues';
import { postMessage, uw } from './utils';

export const partialUpdates$ = $(false);

export const state = $.store<State>({
  trackData: {},
  loading: false,
  get tracks() {
    return this.trackData
      ? (Object.values(this.trackData) as FETrack[])
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((track) => track.id)
      : undefined;
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
