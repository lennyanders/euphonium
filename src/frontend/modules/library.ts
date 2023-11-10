import { $$, store, useMemo } from 'voby';

import { onMessage } from '../utils/worker';

export const state = store<State>({
  libraryDirectories: [],
  trackData: {},
  albumData: {},
  artistData: {},
  loading: true,
});

export const tracks$ = useMemo(() => Object.values(state.trackData));
export const tracksSortedByTitle$ = useMemo(() =>
  $$(tracks$).sort((a, b) => a.title.localeCompare(b.title)),
);

export const albums$ = useMemo(() => Object.values(state.albumData));
export const albumsSortedByTitle$ = useMemo(() =>
  $$(albums$).sort((a, b) => a.title.localeCompare(b.title)),
);

export const artists$ = useMemo(() => Object.values(state.artistData));
export const artistsSortedByName$ = useMemo(() =>
  $$(artists$).sort((a, b) => (b.name && a.name?.localeCompare(b.name)) || 0),
);

export const cleanQueue$ = useMemo(() => {
  return (state.queue || [])
    .map((id) => state.trackData[id])
    .filter((track) => track)
    .map((track) => track.id);
});

onMessage(({ data }) => data.message === 'setState' && Object.assign(state, data.state));
