import { For, If, useComputed } from 'voby';
import { RouterLink } from '../router';
import { library } from '../stores/library';
import { getFormattedTime } from '../utils';

export const Albums = () => {
  const albums = useComputed(() => {
    const albumsObject: Record<
      string,
      { albumTitle: string; albumArtist: string; year?: number; tracks: number; duration: number }
    > = {};
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
    return Object.values(albumsObject).map((album) => ({
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
        <ul class='m-t-4 grid gap-4'>
          <For values={albums}>
            {(album) => (
              <li class='flex flex-wrap gap-2 bg-[#1c1c1c] p-2 rd-2'>
                <span class='flex-basis-100%'>{album.albumTitle}</span>
                <small class='flex-basis-100%'>{album.albumArtist}</small>
                <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.year}</span>
                <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.tracks}</span>
                <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.duration}</span>
              </li>
            )}
          </For>
        </ul>
      </If>
    </>
  );
};
