import { RouterLink } from '../router';
import { CoverImage } from './CoverImage';

export const AlbumList = ({ albums }: { albums: FEAlbum[] }) => (
  <ul class='grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4'>
    {albums.map((album) => (
      <li>
        <RouterLink
          class='flex flex-col justify-end items-start bg-[#1c1c1c] p-1 rd-2 overflow-hidden aspect-1 text-sm relative'
          href={`/artist/${encodeURIComponent(album.artist)}/${encodeURIComponent(album.title)}`}
        >
          <CoverImage src={album.cover} class='absolute top-0 left-0 w-100% h-100%' />
          <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate relative'>{album.title}</span>
          <small class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate relative m-t-1'>
            {album.artist}
          </small>
        </RouterLink>
      </li>
    ))}
  </ul>
);
