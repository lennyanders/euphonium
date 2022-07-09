import { ArtistList } from '../components/ArtistList';
import { RouterLink } from '../router';
import { state } from '../modules/library';
import { Ternary } from 'voby';

export const Artists = () => (
  <Ternary when={state.artistData}>
    <>
      <h1>Artists</h1>
      <ArtistList
        artistIds={() =>
          Object.values(state.artistData)
            .sort((a, b) => (b.name && a.name?.localeCompare(b.name)) || 0)
            .map((artist) => artist.name)
        }
      />
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
