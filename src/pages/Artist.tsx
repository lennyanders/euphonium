import { useComputed } from 'voby';
import { AlbumList } from '../components/AlbumList';
import { HeroImage } from '../components/HeroImage';
import { TrackList } from '../components/TrackList';
import { params, RouterLink } from '../router';
import { library } from '../stores/library';

export const Artist = () => {
  const { artistName } = params();
  if (!artistName) return 'Something went wrong';

  const artist$ = useComputed(() => {
    return library().artists.find((artist) => artist.name === artistName);
  });
  const artist = artist$();

  return (
    <>
      {!artist?.trackCount ? (
        <p>
          You don't have any music for this artist, add directories in the{' '}
          <RouterLink href='/settings' class='underline'>
            settings
          </RouterLink>{' '}
          and start listening to music!
        </p>
      ) : (
        <>
          <HeroImage
            image={artist.image}
            title={artist.name}
            sublines={[
              [artist.trackCount, artist.albums.length, artist.durationFormatted].join(' | '),
            ]}
          />
          {artist.albums.length > 0 && (
            <>
              <h2>Albums ({artist.albums.length})</h2>
              <AlbumList albums={artist.albums} />
            </>
          )}
          {artist.singles.length > 0 && (
            <>
              <h2>Singles ({artist.singles.length})</h2>
              <TrackList tracks={artist.singles} />
            </>
          )}
        </>
      )}
    </>
  );
};
