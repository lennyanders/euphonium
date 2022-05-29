import { useComputed } from 'voby';
import { AlbumList } from '../components/AlbumList';
import { HeroImage } from '../components/HeroImage';
import { TrackList } from '../components/TrackList';
import { params$, RouterLink } from '../router';
import { artists$ } from '../modules/library';

export const Artist = () => {
  const { artistName } = params$();
  if (!artistName) return 'Something went wrong';

  const artist$ = useComputed(() => artists$()?.find((artist) => artist.name === artistName));
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
              <>
                {artist.trackCount} <div class='i-mdi-music-note m-l-.5 m-r-2' />
                {artist.albums.length > 0 && (
                  <>
                    {artist.albums.length} <div class='i-mdi-disk m-l-.5 m-r-2' />
                  </>
                )}
                {artist.durationFormatted} <div class='i-mdi-timer-sand m-l-.5' />
              </>,
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
