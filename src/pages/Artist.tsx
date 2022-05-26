import { useComputed } from 'voby';
import { AlbumList } from '../components/AlbumList';
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
      <h1>{artistName}</h1>
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
          <div class='flex flex-wrap gap-2 m-t--2 m-b-2'>
            <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{artist.trackCount}</span>
            <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{artist.albums.length}</span>
            <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{artist.durationFormatted}</span>
          </div>
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
