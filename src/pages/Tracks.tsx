import { TrackList } from '../components/TrackList';
import { RouterLink } from '../router';
import { state, tracksSortedByTitle$ } from '../modules/library';
import { Ternary, useMemo } from 'voby';

export const Tracks = () => (
  <Ternary when={state.trackData}>
    <>
      <h1>Tracks</h1>
      <TrackList trackIds={useMemo(() => tracksSortedByTitle$().map((track) => track.id))} />
    </>
    {/* no tracks */}
    <p>
      Add directories in the
      <RouterLink href='/settings' class='underline'>
        settings
      </RouterLink>
      and start listening to music!
    </p>
  </Ternary>
);
