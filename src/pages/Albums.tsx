import { AlbumList } from '../components/AlbumList';
import { RouterLink } from '../router';
import { albumsSortedByTitle$, state } from '../modules/library';
import { Ternary, useMemo } from 'voby';

export const Albums = () => (
  <Ternary when={state.albumData}>
    <>
      <h1>Albums</h1>
      <AlbumList
        albumIds={useMemo(() =>
          albumsSortedByTitle$().map((album) => `${album.artist}${album.title}`),
        )}
      />
    </>
    {/* no albums */}
    <p>
      Add directories in the
      <RouterLink href='/settings' class='underline'>
        settings
      </RouterLink>
      and start listening to music!
    </p>
  </Ternary>
);
