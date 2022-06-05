import {
  observeWindowOffset,
  observeWindowRect,
  VirtualItem,
  Virtualizer,
  windowScroll,
} from '@tanstack/virtual-core';
import { $, For, useEffect } from 'voby';
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
  const ul$ = $<HTMLElement>();
  const contentWidth$ = $(0);
  useEffect(() => {
    const ul = ul$();
    if (!ul) return;

    const observer = new ResizeObserver(([ul]) => contentWidth$(ul.contentRect.width));
    observer.observe(ul);
    return () => observer.disconnect();
  });

  const virtualHeight$ = $(0);
  const virtualItems$ = $<VirtualItem<any>[]>([], {
    equals: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
  const itemsPerRow$ = $(0);
  let virtualizer: Virtualizer<Window, any>;
  useEffect(() => {
    const contentWidth = contentWidth$();
    if (!contentWidth) return;

    const itemsPerRow = Math.floor(contentWidth / 140);
    const itemSize = contentWidth / itemsPerRow;

    virtualizer = new Virtualizer<Window, any>({
      count: Math.ceil(albums.length / itemsPerRow),
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
    <ul class='relative m--2' style={{ height: virtualHeight$ }} ref={ul$}>
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
