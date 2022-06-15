import { ArtistList } from '../components/ArtistList';
import { RouterLink } from '../router';
import { state } from '../modules/library';
import { Ternary, useComputed } from 'voby';

export const Artists = () => (
  <Ternary when={() => state.artists?.length}>
    <>
      <h1>Artists</h1>
      <ArtistList artists={useComputed(() => state.artists!)} />
    </>
    {/* no artists */}
    <p>
      Add directories in the{' '}
      <RouterLink href='/settings' class='underline'>
        settings
      </RouterLink>{' '}
      and start listening to music!
    </p>
  </Ternary>
);
