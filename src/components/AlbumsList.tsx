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
    <ul class='grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4'>
      <For values={albums}>
        {(album) => (
          <li>
            <RouterLink
              class='flex flex-col gap-2 bg-[#1c1c1c] p-2 rd-2 h-100%'
              href={`/artist/${album.albumArtist}${album.year ? `/${album.year}` : ''}/${
                album.albumTitle
              }`}
            >
              {album.albumTitle}
              <small>{album.albumArtist}</small>
              <div class='flex flex-wrap gap-2 m-t-a'>
                <If when={album.year}>
                  <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.year}</span>
                </If>
                <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.tracks}</span>
                <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.duration}</span>
              </div>
            </RouterLink>
          </li>
        )}
      </For>
    </ul>
  );
};
