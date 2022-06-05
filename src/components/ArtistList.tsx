import {
  VirtualItem,
  Virtualizer,
  observeWindowRect,
  observeWindowOffset,
  windowScroll,
} from '@tanstack/virtual-core';
import { $, For, useEffect } from 'voby';
import { mainElWidth$ } from '../modules/layout';
import { RouterLink } from '../router';
import { obyJsonEquals } from '../shared/utils';
import { CoverImage } from './CoverImage';

export const ArtistList = ({ artists }: { artists: FEArtist[] }) => {
  const virtualHeight$ = $(0);
  const virtualItems$ = $<VirtualItem<any>[]>([], { equals: obyJsonEquals });
  const itemsPerRow$ = $(0);
  let virtualizer: Virtualizer<Window, any>;
  useEffect(() => {
    const mainElWidth = mainElWidth$();
    if (!mainElWidth) return;

    const contentWidth = mainElWidth + 32;
    const itemsPerRow = Math.floor(contentWidth / 150);
    const itemSize = contentWidth / itemsPerRow + 16 + 24;

    virtualizer = new Virtualizer<Window, any>({
      count: Math.ceil(artists.length / itemsPerRow),
      overscan: 2,
      getScrollElement: () => window,
      estimateSize: () => itemSize,
      observeElementRect: observeWindowRect,
      observeElementOffset: observeWindowOffset,
      scrollToFn: windowScroll,
      onChange: () => {
        virtualItems$(virtualizer.getVirtualItems());
      },
    });

    itemsPerRow$(itemsPerRow);
    virtualHeight$(virtualizer.getTotalSize());
    virtualItems$(virtualizer.getVirtualItems());
  });
  useEffect(() => {
    virtualItems$();
    virtualizer?._willUpdate();
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
                width: size - 16 - 24,
                transform: `translateY(${start}px) translateX(${albumIndex * (size - 16 - 24)}px)`,
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
