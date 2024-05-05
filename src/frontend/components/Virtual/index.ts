import {
  Virtualizer,
  VirtualItem,
  observeWindowRect,
  observeWindowOffset,
  windowScroll,
} from '@tanstack/virtual-core';
import { MaybeRef, computed, ref, unref, watchEffect } from 'vue';

type Ret<T> = VirtualItem & { item: T };

export const useVirtual = <T>(
  config: MaybeRef<{ items: T[]; estimateSize: (item: T) => number }>,
) => {
  const rowVirtualizer = ref<Virtualizer<Window, any>>();
  const getVirualRows = () => {
    return rowVirtualizer.value?.getVirtualItems().map<Ret<T>>((value) => {
      return { ...value, item: unref(config).items[value.index] };
    });
  };

  const virtualRows = ref<Ret<T>[]>();
  watchEffect((cleanup) => {
    rowVirtualizer.value = new Virtualizer<Window, any>({
      getScrollElement: () => window,
      observeElementRect: observeWindowRect,
      observeElementOffset: observeWindowOffset,
      scrollToFn: windowScroll,
      count: unref(config).items.length,
      estimateSize: (index) => unref(config).estimateSize(unref(config).items[index]),
      overscan: 5,
      onChange: () => (virtualRows.value = getVirualRows()),
    });
    rowVirtualizer.value._willUpdate();
    virtualRows.value = getVirualRows();
    cleanup(rowVirtualizer.value._didMount());
  });

  const totalSize = computed(() => `${rowVirtualizer.value?.getTotalSize()}px`);

  return { totalSize, virtualRows };
};
