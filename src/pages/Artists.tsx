import { ArtistList } from '../components/ArtistList';
import { RouterLink } from '../router';
import { library } from '../stores/library';

export const Artists = () => {
  const { artists } = library();
  return (
    <>
      <h1>Artists</h1>
      {!artists.length ? (
        <p>
          Add directories in the{' '}
          <RouterLink href='/settings' class='underline'>
            settings
          </RouterLink>{' '}
          and start listening to music!
        </p>
      ) : (
        <ArtistList artists={artists} />
      )}
    </>
  );
};
