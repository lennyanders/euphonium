import { $, useBatch, useEffect, useCleanup, For } from 'voby';
import { Virtualizer } from '@tanstack/virtual-core';
import { baseOptions, getVirtualItemToStart, getVirtualItems, SharedProps } from './shared';

export interface VirtualProps<T> extends SharedProps<T> {
  ref?: (virtualizer: Virtualizer<Window & typeof globalThis, any>) => void;
}
export const Virtual = <T,>(options: VirtualProps<T>) => {
  const virtualizer = new Virtualizer({
    ...baseOptions,
    overscan: options.overscan,
    count: options.items.length,
    estimateSize: (index) => options.size(options.items[index]),
    onChange: () => {
      const vItems = virtualizer.getVirtualItems();
      useBatch(() => {
        items$(getVirtualItems(vItems));
        itemToStart$(getVirtualItemToStart(vItems));
      });
    },
  });
  const height$ = $(virtualizer.getTotalSize());
  const vItems = virtualizer.getVirtualItems();
  const items$ = $(getVirtualItems(vItems));
  const itemToStart$ = $(getVirtualItemToStart(vItems));
  useEffect(() => {
    items$();
    virtualizer._willUpdate();
  });
  useCleanup(virtualizer._didMount());

  if (options.ref) options.ref(virtualizer);

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
            {options.children(() => options.items[index])}
          </li>
        )}
      </For>
    </ul>
  );
};
