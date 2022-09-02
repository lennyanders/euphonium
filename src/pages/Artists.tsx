import { Ternary, useMemo } from 'voby';

import { ArtistList } from '../components/ArtistList';
import { artistsSortedByName$, state } from '../modules/library';
import { RouterLink } from '../router';

export const Artists = () => (
  <Ternary when={state.artistData}>
    <>
      <h1>Artists</h1>
      <ArtistList artistIds={useMemo(() => artistsSortedByName$().map((artist) => artist.name))} />
    </>
    {/* no artists */}
    <p>
      Add directories in the
      <RouterLink href='/settings' class='underline'>
        settings
      </RouterLink>
      and start listening to music!
    </p>
  </Ternary>
);
