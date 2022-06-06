import { For } from 'voby';
import { mainElWidth$ } from '../modules/layout';
import { useVirtualGrid } from '../modules/virtual';
import { RouterLink } from '../router';
import { CoverImage } from './CoverImage';

export const ArtistList = ({ artists }: { artists: FEArtist[] }) => {
  const widthHeightDifference = 16 + 24;
  const { virtualHeight$, virtualItems$, itemsPerRow$ } = useVirtualGrid({
    overscan: 2,
    count: artists.length,
    parentWidth: mainElWidth$,
    selfWidthDifference: 32,
    itemMinWidth: 150,
    itemHeight: (width) => width + widthHeightDifference,
  });

  return (
    <ul class='relative m--4' style={{ height: virtualHeight$ }}>
      <For values={virtualItems$}>
        {({ index, start, size }) => {
          const itemsPerRow = itemsPerRow$();
          const albumIndex = index * itemsPerRow;
          return artists.slice(albumIndex, albumIndex + itemsPerRow).map((artist, albumIndex) => (
            <li
              class='absolute top-0 left-0 p-4'
              style={{
                width: size - widthHeightDifference,
                transform: `translateY(${start}px) translateX(${
                  albumIndex * (size - widthHeightDifference)
                }px)`,
              }}
            >
              <RouterLink href={`/artist/${artist.name}`} class='block truncate text-center'>
                <CoverImage
                  src={artist.image}
                  class='w-100% rd-50% m-b-4'
                  fallbackCss='mask-size-150% mask-position-center'
                />
                {artist.name}
              </RouterLink>
            </li>
          ));
        }}
      </For>
    </ul>
  );
};
