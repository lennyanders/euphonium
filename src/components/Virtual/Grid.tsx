import { Virtualizer } from '@tanstack/virtual-core';
import {
  $,
  Observable,
  If,
  batch,
  useCleanup,
  useEffect,
  untrack,
  $$,
  ForValue,
  useMemo,
} from 'voby';

import { baseOptions, getVirtualItems, getVirtualItemToStart, SharedProps } from './shared';

interface VirtualGridProps<T> extends Omit<SharedProps<T>, 'size'> {
  parentWidth: Observable<number>;
  selfWidthDifference: number;
  itemMinWidth: number;
  size: (width: number) => number;
}
export const VirtualGrid = <T,>(options: VirtualGridProps<T>) => {
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

    batch(() => {
      const virtualizer = virtualizer$(
        new Virtualizer<Window, any>({
          ...baseOptions,
          count: Math.ceil($$(options.items).length / itemsPerRow),
          overscan: options.overscan,
          estimateSize: () => itemHeight,
          onChange: (virtualizer) => {
            const vItems = virtualizer.getVirtualItems();
            batch(() => {
              items$(getVirtualItems(vItems));
              itemsToStart$(getVirtualItemToStart(vItems));
            });
          },
        }),
      )!;
      const vItems = virtualizer.getVirtualItems();
      batch(() => {
        itemWidth$(itemWidth);
        itemsPerRow$(itemsPerRow);
        height$(virtualizer.getTotalSize());
        items$(getVirtualItems(vItems));
        itemsToStart$(getVirtualItemToStart(vItems));
      });
      useCleanup(virtualizer._didMount());
    });
  });
  useEffect(() => {
    $$(items$);
    untrack(virtualizer$)?._willUpdate();
  });

  return (
    <ul class={options.ulClass} style={{ height: height$, position: 'relative' }}>
      <ForValue values={items$}>
        {(indexRow$) => (
          <ForValue values={() => Array.from({ length: $$(itemsPerRow$) }).map((_, i) => i)}>
            {(indexCol$) => {
              const index$ = useMemo(() => $$(indexRow$) * $$(itemsPerRow$) + $$(indexCol$));
              const item$ = useMemo(() => $$(options.items)[$$(index$)]);
              return (
                <If when={item$}>
                  <li
                    class={options.liClass}
                    style={{
                      width: itemWidth$,
                      transform: () =>
                        `translateY(${$$(itemsToStart$)[$$(indexRow$)]}px) translateX(${
                          $$(itemWidth$) * $$(indexCol$)
                        }px)`,
                      position: 'absolute',
                    }}
                  >
                    {options.children(item$, index$)}
                  </li>
                </If>
              );
            }}
          </ForValue>
        )}
      </ForValue>
    </ul>
  );
};
