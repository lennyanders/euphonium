import { computed, reactive } from 'vue';

import { onMessage } from '../utils/worker';

export const state = reactive<State>({
  libraryDirectories: [],
  trackData: {},
  albumData: {},
  artistData: {},
  loading: true,
});

export const tracks = computed(() => Object.values(state.trackData));
export const tracksSortedByTitle = computed(() => {
  return tracks.value.sort((a, b) => a.title.localeCompare(b.title));
});

export const albums = computed(() => Object.values(state.albumData));
export const albumsSortedByTitle = computed(() =>
  albums.value.sort((a, b) => a.title.localeCompare(b.title)),
);

export const artists = computed(() => Object.values(state.artistData));
export const artistsSortedByName = computed(() =>
  artists.value.sort((a, b) => (b.name && a.name?.localeCompare(b.name)) || 0),
);

export const cleanQueue = computed(() => {
  if (!state.queue) return [];
  return state.queue
    .map((id) => state.trackData[id])
    .filter((track) => track)
    .map((track) => track.id);
});

onMessage(({ data }) => data.message === 'setState' && Object.assign(state, data.state));
