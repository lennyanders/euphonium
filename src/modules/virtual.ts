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

const getVvirtualItemsIndexes = (items: VirtualItem<any>[]) => items.map(({ index }) => index);

const getVirtualItemsIndexesToStart = (items: VirtualItem<any>[]) => {
  return items.reduce<Record<number, number>>(
    (res, item) => ({ ...res, [item.index]: item.start }),
    {},
  );
};

export const useVirtual = (
  options: Pick<VirtualizerOptions, 'count' | 'overscan' | 'estimateSize'>,
) => {
  const virtualizer = new Virtualizer({
    ...baseOptions,
    ...options,
    onChange: () => {
      const items = virtualizer.getVirtualItems();
      useBatch(() => {
        virtualItemsIndexes$(getVvirtualItemsIndexes(items));
        virtualItemsIndexesToStart$(getVirtualItemsIndexesToStart(items));
      });
    },
  });
  const virtualHeight$ = $(virtualizer.getTotalSize());
  const items = virtualizer.getVirtualItems();
  const virtualItemsIndexes$ = $(getVvirtualItemsIndexes(items));
  const virtualItemsIndexesToStart$ = $(getVirtualItemsIndexesToStart(items));
  useEffect(() => {
    virtualItemsIndexes$();
    virtualizer._willUpdate();
  });
  return { virtualizer, virtualHeight$, virtualItemsIndexes$, virtualItemsIndexesToStart$ };
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
