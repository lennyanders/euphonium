import { For } from 'voby';
import { mainElWidth$ } from '../modules/layout';
import { useVirtualGrid } from '../modules/virtual';
import { RouterLink } from '../router';
import { CoverImage } from './CoverImage';

const Album = ({ album }: { album: FEAlbum }) => (
  <RouterLink
    class='flex flex-col justify-end items-start bg-[#1c1c1c] p-1 rd-2 overflow-hidden aspect-1 text-sm relative'
    href={`/artist/${encodeURIComponent(album.artist)}/${encodeURIComponent(album.title)}`}
  >
    <CoverImage src={album.cover} class='absolute top-0 left-0 w-100% h-100%' />
    <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate relative'>{album.title}</span>
    <small class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate relative m-t-1'>{album.artist}</small>
  </RouterLink>
);

export const AlbumList = ({ albums }: { albums: FEAlbum[] }) => {
  const { virtualHeight$, virtualItems$, itemsPerRow$ } = useVirtualGrid({
    overscan: 2,
    count: albums.length,
    parentWidth: mainElWidth$,
    selfWidthDifference: 16,
    itemMinWidth: 140,
    itemHeight: (width) => width,
  });

  return (
    <ul class='relative m--2' style={{ height: virtualHeight$ }}>
      <For values={virtualItems$}>
        {({ index, start, size }) => {
          const itemsPerRow = itemsPerRow$();
          const albumIndex = index * itemsPerRow;
          return albums.slice(albumIndex, albumIndex + itemsPerRow).map((album, albumIndex) => (
            <li
              class='absolute top-0 left-0 p-2'
              style={{
                width: size,
                transform: `translateY(${start}px) translateX(${albumIndex * size}px)`,
              }}
            >
              <Album album={album} />
            </li>
          ));
        }}
      </For>
    </ul>
  );
};
