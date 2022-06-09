import { $, useBatch, useEffect, useSample } from 'voby';
import {
  observeWindowOffset,
  observeWindowRect,
  VirtualItem,
  Virtualizer,
  VirtualizerOptions,
  windowScroll,
} from '@tanstack/virtual-core';
import { obyJsonEquals } from '../shared/utils';
import { Observable } from 'oby';

const baseOptions = {
  getScrollElement: () => window,
  observeElementRect: observeWindowRect,
  observeElementOffset: observeWindowOffset,
  scrollToFn: windowScroll,
};

const getVvirtualItems = <T>(vItems: VirtualItem<any>[], items: T[]) => {
  return vItems.map((vItem) => items[vItem.index]);
};

const getVirtualItemToStart = <T>(vItems: VirtualItem<any>[], items: T[]) => {
  const map = new Map<T, number>();
  for (const vItem of vItems) map.set(items[vItem.index], vItem.start);
  return map;
};

type VirtualProps<T> = { items: T[]; overscan: number; size: (item: T) => number };
export const useVirtual = <T>({ items, overscan, size }: VirtualProps<T>) => {
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
  return { virtualizer, virtualHeight$, virtualItems$, virtualItemToStart$ };
};

export const useVirtualGrid = (
  options: Pick<VirtualizerOptions, 'overscan'> & {
    count: number;
    parentWidth: Observable<number>;
    selfWidthDifference: number;
    itemMinWidth: number;
    itemHeight: number | ((width: number) => number);
  },
) => {
  const virtualHeight$ = $(0);
  const virtualItems$ = $<VirtualItem<any>[]>([], { equals: obyJsonEquals });
  const itemsPerRow$ = $(0);
  const virtualizer$ = $<Virtualizer<Window, any>>();
  useEffect(() => {
    const mainElWidth = options.parentWidth();
    if (!mainElWidth) return;

    const contentWidth = mainElWidth + options.selfWidthDifference;
    const itemsPerRow = Math.floor(contentWidth / options.itemMinWidth);
    const itemWidth = contentWidth / itemsPerRow;
    const itemHeight =
      typeof options.itemHeight === 'number' ? options.itemHeight : options.itemHeight(itemWidth);

    useBatch(() => {
      const virtualizer = virtualizer$(
        new Virtualizer<Window, any>({
          ...baseOptions,
          count: Math.ceil(options.count / itemsPerRow),
          overscan: options.overscan,
          estimateSize: () => itemHeight,
          onChange: (virtualizer) => {
            virtualItems$(virtualizer.getVirtualItems());
          },
        }),
      );
      itemsPerRow$(itemsPerRow);
      virtualHeight$(virtualizer!.getTotalSize());
      virtualItems$(virtualizer!.getVirtualItems());
    });
  });
  useEffect(() => {
    virtualItems$();
    useSample(virtualizer$)?._willUpdate();
  });
  return { virtualizer$, virtualHeight$, virtualItems$, itemsPerRow$ };
};
