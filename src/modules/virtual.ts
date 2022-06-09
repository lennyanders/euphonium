import { $, useBatch, useCleanup, useEffect, useSample } from 'voby';
import {
  observeWindowOffset,
  observeWindowRect,
  VirtualItem,
  Virtualizer,
  windowScroll,
} from '@tanstack/virtual-core';
import { Observable } from 'oby';

const baseOptions = {
  getScrollElement: () => window,
  observeElementRect: observeWindowRect,
  observeElementOffset: observeWindowOffset,
  scrollToFn: windowScroll,
};

type VirtualProps<T> = { items: T[]; overscan: number; size: (item: T) => number };
export const useVirtual = <T>({ items, overscan, size }: VirtualProps<T>) => {
  const getVvirtualItems = (vItems: VirtualItem<any>[], items: T[]) => {
    return vItems.map((vItem) => items[vItem.index]);
  };
  const getVirtualItemToStart = (vItems: VirtualItem<any>[], items: T[]) => {
    const map = new Map<T, number>();
    for (const vItem of vItems) map.set(items[vItem.index], vItem.start);
    return map;
  };

  const virtualizer = new Virtualizer({
    ...baseOptions,
    overscan,
    count: items.length,
    estimateSize: (index) => size(items[index]),
    onChange: () => {
      const vItems = virtualizer.getVirtualItems();
      useBatch(() => {
        virtualItems$(getVvirtualItems(vItems, items));
        virtualItemToStart$(getVirtualItemToStart(vItems, items));
      });
    },
  });
  const virtualHeight$ = $(virtualizer.getTotalSize());
  const vItems = virtualizer.getVirtualItems();
  const virtualItems$ = $(getVvirtualItems(vItems, items));
  const virtualItemToStart$ = $(getVirtualItemToStart(vItems, items));
  useEffect(() => {
    virtualItems$();
    virtualizer._willUpdate();
  });
  useCleanup(virtualizer._didMount());
  return { virtualizer, virtualHeight$, virtualItems$, virtualItemToStart$ };
};

type VirtualGridProps<T> = Omit<VirtualProps<T>, 'size'> & {
  parentWidth: Observable<number>;
  selfWidthDifference: number;
  itemMinWidth: number;
  size: (width: number) => number;
};
export const useVirtualGrid = <T>(options: VirtualGridProps<T>) => {
  const getVirtualItems = (vItems: VirtualItem<any>[]) => vItems.map((vItem) => vItem.index);
  const getVirtualItemToInfo = (vItems: VirtualItem<any>[]) => {
    const map: Record<number, number> = {};
    for (const { index, start } of vItems) map[index] = start;
    return map;
  };

  const virtualizer$ = $<Virtualizer<Window, any>>();
  const height$ = $(0);
  const items$ = $<number[]>([]);
  const itemsToStart$ = $<Record<number, number>>({});
  const itemWidth$ = $(0);
  const itemsPerRow$ = $(0);
  useEffect(() => {
    const mainElWidth = options.parentWidth();
    if (!mainElWidth) return;

    const contentWidth = mainElWidth + options.selfWidthDifference;
    const itemsPerRow = Math.floor(contentWidth / options.itemMinWidth);
    const itemWidth = contentWidth / itemsPerRow;
    const itemHeight = options.size(itemWidth);

    useBatch(() => {
      const virtualizer = virtualizer$(
        new Virtualizer<Window, any>({
          ...baseOptions,
          count: Math.ceil(options.items.length / itemsPerRow),
          overscan: options.overscan,
          estimateSize: () => itemHeight,
          onChange: (virtualizer) => {
            const vItems = virtualizer.getVirtualItems();
            useBatch(() => {
              items$(getVirtualItems(vItems));
              itemsToStart$(getVirtualItemToInfo(vItems));
            });
          },
        }),
      )!;
      const vItems = virtualizer.getVirtualItems();
      useBatch(() => {
        itemWidth$(itemWidth);
        itemsPerRow$(itemsPerRow);
        height$(virtualizer.getTotalSize());
        items$(getVirtualItems(vItems));
        itemsToStart$(getVirtualItemToInfo(vItems));
      });
      useCleanup(virtualizer._didMount());
    });
  });
  useEffect(() => {
    items$();
    useSample(virtualizer$)?._willUpdate();
  });
  return { virtualizer$, height$, items$, itemsToStart$, itemWidth$, itemsPerRow$ };
};
