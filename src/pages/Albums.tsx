import { AlbumList } from '../components/AlbumList';
import { RouterLink } from '../router';
import { state } from '../modules/library';
import { Ternary, useMemo } from 'voby';

export const Albums = () => (
  <Ternary when={state.albumData}>
    <>
      <h1>Albums</h1>
      <AlbumList
        albumIds={useMemo(() =>
          Object.values(state.albumData)
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((album) => `${album.artist}${album.title}`),
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
