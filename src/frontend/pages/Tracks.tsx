import { $$, Ternary, useMemo } from 'voby';

import { TrackList } from '../components/TrackList';
import { state, tracksSortedByTitle$ } from '../modules/library';

export const Tracks = () => (
  <Ternary when={state.trackData}>
    <>
      <h1>Tracks</h1>
      <TrackList trackIds={useMemo(() => $$(tracksSortedByTitle$).map((track) => track.id))} />
    </>
    {/* no tracks */}
    <p>
      Add directories in the
      <a href='/settings' class='underline'>
        settings
      </a>
      and start listening to music!
    </p>
  </Ternary>
);
