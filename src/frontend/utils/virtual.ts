import { useWindowVirtualizer, VirtualItem, VirtualizerOptions } from '@tanstack/vue-virtual';
import { MaybeRef, Ref, computed, unref } from 'vue';

type Ret<T> = VirtualItem & { item: T };

export const useVirtual = <T>(
  config: MaybeRef<
    Partial<
      Omit<
        VirtualizerOptions<Window, Element>,
        | 'observeElementRect'
        | 'observeElementOffset'
        | 'scrollToFn'
        | 'getScrollElement'
        | 'count'
        | 'estimateSize'
        | 'scrollMargin'
      >
    > & {
      items: T[];
      estimateSize: (item: T) => number;
      listRef: Ref<HTMLElement | undefined>;
    }
  >,
) => {
  const virtualizer = useWindowVirtualizer(
    computed(() => {
      const { items, estimateSize, listRef, ...virtualizerOptions } = unref(config);
      return {
        count: items.length,
        estimateSize: (index) => estimateSize(items[index]),
        overscan: 5,
        initialOffset: window.scrollY,
        scrollMargin: listRef?.value?.offsetTop ?? 0,
        ...virtualizerOptions,
      };
    }),
  );

  const totalSize = computed(() => `${virtualizer.value?.getTotalSize()}px`);

  const virtualRows = computed(() => {
    return virtualizer.value?.getVirtualItems().map<Ret<T>>((value) => ({
      ...value,
      start: value.start - virtualizer.value.options.scrollMargin,
      item: unref(config).items[value.index],
    }));
  });

  return { virtualizer, totalSize, virtualRows };
};
