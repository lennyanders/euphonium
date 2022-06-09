import { For, If } from 'voby';
import { mainElWidth$ } from '../modules/layout';
import { useVirtualGrid } from '../modules/virtual';
import { RouterLink } from '../router';
import { CoverImage } from './CoverImage';

export const ArtistList = ({ artists }: { artists: FEArtist[] }) => {
  const widthHeightDifference = 16 + 24;
  const { height$, items$, itemsToStart$, itemWidth$, itemsPerRow$ } = useVirtualGrid({
    items: artists,
    overscan: 5,
    parentWidth: mainElWidth$,
    selfWidthDifference: 32,
    itemMinWidth: 150,
    size: (width) => width + widthHeightDifference,
  });

  return (
    <ul class='relative m--4' style={{ height: height$ }}>
      <For values={items$}>
        {(index) => (
          <For values={() => Array.from({ length: itemsPerRow$() }).map((_, i) => i)}>
            {(colIndex) => (
              <If when={() => artists[index * itemsPerRow$() + colIndex]}>
                <li
                  class='absolute top-0 left-0 p-4'
                  style={{
                    width: itemWidth$,
                    transform: () =>
                      `translateY(${itemsToStart$()[index]}px) translateX(${
                        itemWidth$() * colIndex
                      }px)`,
                  }}
                >
                  <RouterLink
                    href={() => `/artist/${artists[index * itemsPerRow$() + colIndex].name}`}
                    class='block truncate text-center'
                  >
                    <CoverImage
                      src={() => artists[index * itemsPerRow$() + colIndex].image!}
                      css='w-100% rd-50% m-b-4 background-size-125%'
                    />
                    {() => artists[index * itemsPerRow$() + colIndex].name}
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
