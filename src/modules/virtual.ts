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

export const useVirtual = (
  options: Pick<VirtualizerOptions, 'count' | 'overscan' | 'estimateSize'>,
) => {
  const virtualizer = new Virtualizer({
    ...baseOptions,
    ...options,
    onChange: () => {
      virtualItems$(virtualizer.getVirtualItems());
    },
  });
  const virtualHeight$ = $(virtualizer.getTotalSize());
  const virtualItems$ = $(virtualizer.getVirtualItems(), { equals: obyJsonEquals });
  useEffect(() => {
    virtualItems$();
    virtualizer._willUpdate();
  });
  return { virtualizer, virtualHeight$, virtualItems$ };
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
