import { ArtistList } from '../components/ArtistList';
import { RouterLink } from '../router';
import { library } from '../stores/library';

export const AlbumArtists = () => {
  const { artists } = library();
  const albumArtists = artists.filter((artist) => artist.albums.length);
  return (
    <>
      <h1>Album Artists</h1>
      {!albumArtists.length ? (
        <p>
          Add directories in the{' '}
          <RouterLink href='/settings' class='underline'>
            settings
          </RouterLink>{' '}
          and start listening to music!
        </p>
      ) : (
        <ArtistList artists={albumArtists} />
      )}
    </>
  );
};
