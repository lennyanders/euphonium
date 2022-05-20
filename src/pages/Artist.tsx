import { If, useComputed } from 'voby';
import { Album, AlbumsList, RawAlbums } from '../components/AlbumsList';
import { TracksList } from '../components/TracksList';
import { params, RouterLink } from '../router';
import { library } from '../stores/library';
import { getFormattedTime } from '../utils';
import { Track } from '../worker/database';

export const Artist = () => {
  const { artist } = params();
  if (!artist) return 'Something went wrong';

  const artistData = useComputed(() => {
    const albumsObject: RawAlbums = {};
    const singles: Track[] = [];
    let tracks = 0;
    let duration = 0;
    for (const track of library().tracks) {
      if (track.albumTitle && track.albumArtist === artist) {
        tracks++;
        duration += track.duration;
        const key = `${track.albumArtist}${track.albumTitle}${track.year}`;
        const albumObject = albumsObject[key];
        if (albumObject) {
          albumObject.tracks++;
          albumObject.duration += track.duration;
        } else {
          albumsObject[key] = {
            albumTitle: track.albumTitle,
            albumArtist: track.albumArtist || 'unknown artist',
            year: track.year,
            tracks: 1,
            duration: track.duration,
          };
        }
      } else if (!track.albumTitle && track.artist === artist) {
        tracks++;
        duration += track.duration;
        singles.push(track);
      }
    }
    return {
      albums: Object.values(albumsObject).map<Album>((album) => ({
        ...album,
        duration: getFormattedTime(album.duration),
      })),
      singles,
      tracks,
      duration: getFormattedTime(duration),
    };
  });

  const { tracks, duration, albums, singles } = artistData();

  return (
    <>
      <h1>{artist}</h1>
      <If when={!albums.length && !singles.length}>
        <p>
          You don't have any music for this artist add directories in the{' '}
          <RouterLink href='/settings' class='underline'>
            settings
          </RouterLink>{' '}
          and start listening to music!
        </p>
      </If>
      <If when={albums.length || singles.length}>
        <div class='flex flex-wrap gap-2 m-t--2 m-b-2'>
          <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{tracks}</span>
          <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{albums.length}</span>
          <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{duration}</span>
        </div>
      </If>
      <If when={albums.length}>
        <h2>Albums ({albums.length})</h2>
        <AlbumsList albums={albums} />
      </If>
      <If when={singles.length}>
        <h2>Singles ({singles.length})</h2>
        <TracksList tracks={singles} />
      </If>
    </>
  );
};
