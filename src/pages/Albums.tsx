import { AlbumList } from '../components/AlbumList';
import { RouterLink } from '../router';
import { state } from '../modules/library';

export const Albums = () => {
  const { albums } = state;
  return (
    <>
      <h1>Albums</h1>
      {!albums?.length ? (
        <p>
          Add directories in the{' '}
          <RouterLink href='/settings' class='underline'>
            settings
          </RouterLink>{' '}
          and start listening to music!
        </p>
      ) : (
        <AlbumList albumIds={albums} />
      )}
    </>
  );
};
