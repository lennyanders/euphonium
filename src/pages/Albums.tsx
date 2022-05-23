import { AlbumsList } from '../components/AlbumsList';
import { RouterLink } from '../router';
import { library } from '../stores/library';

export const Albums = () => {
  const albums = library().albums;

  return (
    <>
      <h1>Albums ({albums.length})</h1>
      {!albums.length ? (
        <p>
          Add directories in the{' '}
          <RouterLink href='/settings' class='underline'>
            settings
          </RouterLink>{' '}
          and start listening to music!
        </p>
      ) : (
        <AlbumsList albums={albums} />
      )}
    </>
  );
};
