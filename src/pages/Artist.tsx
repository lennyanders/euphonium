import { useComputed } from 'voby';
import { AlbumsList } from '../components/AlbumsList';
import { TracksList } from '../components/TracksList';
import { params, RouterLink } from '../router';
import { getFormattedTime } from '../shared/utils';
import { library } from '../stores/library';

export const Artist = () => {
  const { artist } = params();
  if (!artist) return 'Something went wrong';

  const artistData = useComputed(() => {
    const { tracks, albums } = library();
    const singles: FETrack[] = [];
    let duration = 0;
    let trackscount = 0;
    for (const track of tracks) {
      if (!track.albumTitle && track.artist === artist) {
        trackscount++;
        duration += track.duration;
        singles.push(track);
      }
    }
    const artistAlbums = albums.filter((a) => a.artist === artist);
    return {
      albums: artistAlbums,
      singles,
      tracks: artistAlbums.reduce((res, val) => res + val.tracks.length, trackscount),
      duration: getFormattedTime(artistAlbums.reduce((res, val) => res + val.duration, duration)),
    };
  });

  const { tracks, duration, albums, singles } = artistData();

  return (
    <>
      <h1>{artist}</h1>
      {!albums.length && !singles.length ? (
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
            <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{tracks}</span>
            <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{albums.length}</span>
            <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{duration}</span>
          </div>
          {albums.length > 0 && (
            <>
              <h2>Albums ({albums.length})</h2>
              <AlbumsList albums={albums} />
            </>
          )}
          {singles.length > 0 && (
            <>
              <h2>Singles ({singles.length})</h2>
              <TracksList tracks={singles} />
            </>
          )}
        </>
      )}
    </>
  );
};
