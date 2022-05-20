import { For, If, useComputed } from 'voby';
import { RouterLink } from '../router';
import { library } from '../store/library';
import { getFormattedTime } from '../utils';

export const Artists = () => {
  const artists = useComputed(() => {
    const artistsObject: Record<string, { tracks: number; duration: number; albums: Set<string> }> =
      {};
    for (const { artist, duration, albumTitle, albumArtist } of library().tracks) {
      const key = artist || 'unknown artist';
      const artistObject = artistsObject[key];
      if (artistObject) {
        artistObject.tracks += 1;
        artistObject.duration += duration;
        if (albumTitle && artist === albumArtist) artistObject.albums.add(albumTitle);
      } else {
        artistsObject[key] = {
          tracks: 1,
          duration,
          albums: new Set(albumTitle && artist === albumArtist ? [albumTitle] : null),
        };
      }
    }
    return Object.entries(artistsObject).map(([name, { tracks, duration, albums }]) => ({
      name,
      tracks,
      duration: getFormattedTime(duration),
      albums: albums.size,
    }));
  });

  return (
    <>
      <h1>Artists</h1>
      <If
        when={artists().length}
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
          <For values={artists}>
            {(artist) => (
              <li class='flex flex-wrap gap-2 bg-[#1c1c1c] p-2 rd-2'>
                <span class='flex-basis-100%'>{artist.name}</span>
                <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{artist.tracks}</span>
                <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{artist.albums}</span>
                <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{artist.duration}</span>
              </li>
            )}
          </For>
        </ul>
      </If>
    </>
  );
};
