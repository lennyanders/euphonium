import { RouterLink } from '../router';

export const AlbumsList = ({ albums }: { albums: FEAlbum[] }) => {
  return (
    <ul class='grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4'>
      {albums.map((album) => (
        <li>
          <RouterLink
            class='flex flex-col gap-2 bg-[#1c1c1c] p-2 rd-2 h-100%'
            href={`/artist/${album.artist}${album.year ? `/${album.year}` : ''}/${album.title}`}
          >
            {album.title}
            <small>{album.artist}</small>
            <div class='flex flex-wrap gap-2 m-t-a'>
              {album.year && (
                <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.year}</span>
              )}
              <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{album.tracks.length}</span>
              <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>
                {album.durationFormatted}
              </span>
            </div>
          </RouterLink>
        </li>
      ))}
    </ul>
  );
};
