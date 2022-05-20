import { If, useComputed } from 'voby';
import { Album, AlbumsList, RawAlbums } from '../components/AlbumsList';
import { RouterLink } from '../router';
import { library } from '../stores/library';
import { getFormattedTime } from '../utils';

export const Albums = () => {
  const albums = useComputed(() => {
    const albumsObject: RawAlbums = {};
    for (const { duration, albumTitle, albumArtist, year } of library().tracks) {
      if (!albumTitle) continue;

      const key = `${albumArtist}${albumTitle}${year}`;
      const albumObject = albumsObject[key];
      if (albumObject) {
        albumObject.tracks++;
        albumObject.duration += duration;
      } else {
        albumsObject[key] = {
          albumTitle,
          albumArtist: albumArtist || 'unknown artist',
          year,
          tracks: 1,
          duration,
        };
      }
    }
    return Object.values(albumsObject).map<Album>((album) => ({
      ...album,
      duration: getFormattedTime(album.duration),
    }));
  });

  return (
    <>
      <h1>Albums ({albums().length})</h1>
      <If
        when={albums().length}
        fallback={
          <p>
            Add directories in the{' '}
            <RouterLink href='/settings' class='underline'>
              settings
            </RouterLink>{' '}
            and start listening to music!
          </p>
        }
      >
        <AlbumsList albums={albums} />
      </If>
    </>
  );
};
