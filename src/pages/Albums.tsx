import { AlbumList } from '../components/AlbumList';
import { RouterLink } from '../router';
import { state } from '../modules/library';
import { Ternary, useComputed } from 'voby';

export const Albums = () => (
  <Ternary when={() => state.albums?.length}>
    <>
      <h1>Albums</h1>
      <AlbumList albumIds={useComputed(() => state.albums!)} />
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
