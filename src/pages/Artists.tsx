import { ArtistList } from '../components/ArtistList';
import { RouterLink } from '../router';
import { artistsSortedByName$, state } from '../modules/library';
import { Ternary, useMemo } from 'voby';

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
