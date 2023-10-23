import { $$, Ternary, useMemo } from 'voby';

import { ArtistList } from '../components/ArtistList';
import { artistsSortedByName$, state } from '../modules/library';

export const Artists = () => (
  <Ternary when={state.artistData}>
    <>
      <h1>Artists</h1>
      <ArtistList
        artistIds={useMemo(() => $$(artistsSortedByName$).map((artist) => artist.name))}
      />
    </>
    {/* no artists */}
    <p>
      Add directories in the
      <a href='/settings' class='underline'>
        settings
      </a>
      and start listening to music!
    </p>
  </Ternary>
);
