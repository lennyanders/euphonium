import { $, $$, useBatch, useEffect, useCleanup, For, useSample } from 'voby';
import { Virtualizer } from '@tanstack/virtual-core';
import { baseOptions, getVirtualItemToStart, getVirtualItems, SharedProps } from './shared';

export interface VirtualProps<T> extends SharedProps<T> {
  ref?: (virtualizer: Virtualizer<Window & typeof globalThis, any>) => void;
}
export const Virtual = <T,>(options: VirtualProps<T>) => {
  const virtualizer$ = $<Virtualizer<Window & typeof globalThis, any>>();
  const height$ = $(0);
  const items$ = $<number[]>([]);
  const itemToStart$ = $<Record<number, number>>({});
  useEffect(() => {
    const virtualizer = virtualizer$(
      new Virtualizer({
        ...baseOptions,
        overscan: options.overscan,
        count: $$(options.items).length,
        estimateSize: (index) => options.size($$(options.items)[index]),
        onChange: () => {
          const vItems = virtualizer.getVirtualItems();
          useBatch(() => {
            items$(getVirtualItems(vItems));
            itemToStart$(getVirtualItemToStart(vItems));
          });
        },
      }),
    )!;
    height$(virtualizer.getTotalSize());
    const vItems = virtualizer.getVirtualItems();
    items$(getVirtualItems(vItems));
    itemToStart$(getVirtualItemToStart(vItems));
    options.ref?.(virtualizer);
    useCleanup(virtualizer._didMount());
  });
  useEffect(() => {
    items$();
    useSample(virtualizer$)?._willUpdate();
  });

  return (
    <ul class={options.ulClass} style={{ height: height$, position: 'relative' }}>
      <For values={items$}>
        {(index) => (
          <li
            class={options.liClass}
            style={{
              transform: () => `translateY(${itemToStart$()[index]}px) `,
              position: 'absolute',
              width: '100%',
            }}
          >
            {options.children(() => $$(options.items)[index], index)}
          </li>
        )}
      </For>
    </ul>
  );
};
