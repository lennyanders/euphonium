import { For, Observable } from 'voby';

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
  );
};
