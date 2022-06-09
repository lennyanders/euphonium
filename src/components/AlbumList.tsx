import { For, If } from 'voby';
import { mainElWidth$ } from '../modules/layout';
import { useVirtualGrid } from '../modules/virtual';
import { RouterLink } from '../router';
import { CoverImage } from './CoverImage';

export const AlbumList = ({ albums }: { albums: FEAlbum[] }) => {
  const { height$, items$, itemsToStart$, itemWidth$, itemsPerRow$ } = useVirtualGrid({
    items: albums,
    overscan: 5,
    parentWidth: mainElWidth$,
    selfWidthDifference: 16,
    itemMinWidth: 140,
    size: (width) => width,
  });

  return (
    <ul class='relative m--2' style={{ height: height$ }}>
      <For values={items$}>
        {(index) => (
          <For values={() => Array.from({ length: itemsPerRow$() }).map((_, i) => i)}>
            {(colIndex) => (
              <If when={() => albums[index * itemsPerRow$() + colIndex]}>
                <li
                  class='absolute top-0 left-0 p-2'
                  style={{
                    width: itemWidth$,
                    transform: () =>
                      `translateY(${itemsToStart$()[index]}px) translateX(${
                        itemWidth$() * colIndex
                      }px)`,
                  }}
                >
                  <RouterLink
                    class='flex flex-col justify-end items-start bg-[#1c1c1c] p-1 rd-2 overflow-hidden aspect-1 text-sm relative'
                    href={() =>
                      `/artist/${encodeURIComponent(
                        albums[index * itemsPerRow$() + colIndex].artist,
                      )}/${encodeURIComponent(albums[index * itemsPerRow$() + colIndex].title)}`
                    }
                  >
                    <CoverImage
                      src={() => albums[index * itemsPerRow$() + colIndex].cover!}
                      css='absolute top-0 left-0 w-100% h-100%'
                    />
                    <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate relative'>
                      {() => albums[index * itemsPerRow$() + colIndex].title}
                    </span>
                    <small class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate relative m-t-1'>
                      {() => albums[index * itemsPerRow$() + colIndex].artist}
                    </small>
                  </RouterLink>
                </li>
              </If>
            )}
          </For>
        )}
      </For>
    </ul>
  );
};
