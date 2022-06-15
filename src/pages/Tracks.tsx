import { TrackList } from '../components/TrackList';
import { RouterLink } from '../router';
import { state } from '../modules/library';
import { Ternary, useComputed } from 'voby';

export const Tracks = () => (
  <Ternary when={state.tracks}>
    <>
      <h1>Tracks</h1>
      <TrackList trackIds={useComputed(() => state.tracks!)} />
    </>
    {/* no tracks */}
    <p>
      Add directories in the{' '}
      <RouterLink href='/settings' class='underline'>
        settings
      </RouterLink>{' '}
      and start listening to music!
    </p>
  </Ternary>
);
