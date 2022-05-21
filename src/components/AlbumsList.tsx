import { For, If, Observable } from 'voby';
import { RouterLink } from '../router';

export type Album = {
  albumTitle: string;
  albumArtist: string;
  year?: number;
  tracks: number;
  duration: string;
};

export type RawAlbums = Record<string, Omit<Album, 'duration'> & { duration: number }>;

export const AlbumsList = ({ albums }: { albums: Album[] | Observable<Album[]> }) => {
  return (
    <ul class='grid gap-4'>
      <For values={albums}>
        {(album) => (
          <li>
            <RouterLink
              class='flex flex-wrap gap-2 bg-[#1c1c1c] p-2 rd-2'
              href={`/artist/${album.albumArtist}${album.year ? `/${album.year}` : ''}/${
                album.albumTitle
              }`}
            >
              <span class='flex-basis-100%'>{album.albumTitle}</span>
              <small class='flex-basis-100%'>{album.albumArtist}</small>
              <If when={album.year}>
                <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.year}</span>
              </If>
              <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.tracks}</span>
              <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.duration}</span>
            </RouterLink>
          </li>
        )}
      </For>
    </ul>
  );
};
