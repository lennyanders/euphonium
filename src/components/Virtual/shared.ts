import {
  observeWindowOffset,
  observeWindowRect,
  VirtualItem,
  windowScroll,
} from '@tanstack/virtual-core';
import { FunctionMaybe } from 'voby';

export interface SharedProps<T> {
  items: T[];
  overscan: number;
  size: (item: T) => number;
  children: (item: () => T) => JSX.Child;
  ulClass?: FunctionMaybe<string>;
  liClass?: FunctionMaybe<string>;
}

export const baseOptions = {
  getScrollElement: () => window,
  observeElementRect: observeWindowRect,
  observeElementOffset: observeWindowOffset,
  scrollToFn: windowScroll,
};

export const getVirtualItems = (vItems: VirtualItem<any>[]) => vItems.map((vItem) => vItem.index);

export const getVirtualItemToStart = (vItems: VirtualItem<any>[]) => {
  const map: Record<number, number> = {};
  for (const { index, start } of vItems) map[index] = start;
  return map;
};