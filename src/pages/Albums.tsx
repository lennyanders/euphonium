import { $$, Ternary, useMemo } from 'voby';

import { AlbumList } from '../components/AlbumList';
import { albumsSortedByTitle$, state } from '../modules/library';

export const Albums = () => (
  <Ternary when={state.albumData}>
    <>
      <h1>Albums</h1>
      <AlbumList
        albumIds={useMemo(() =>
          $$(albumsSortedByTitle$).map((album) => `${album.artist}${album.title}`),
        )}
      />
    </>
    {/* no albums */}
    <p>
      Add directories in the
      <a href='/settings' class='underline'>
        settings
      </a>
      and start listening to music!
    </p>
  </Ternary>
);
