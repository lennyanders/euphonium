import { useVirtualizer, VirtualItem, VirtualizerOptions } from '@tanstack/vue-virtual';
import { computed, MaybeRef, Ref, unref } from 'vue';

type Ret<T> = VirtualItem & { item: T };

export const useVirtual = <T>(
  config: MaybeRef<
    Partial<
      Omit<
        VirtualizerOptions<HTMLElement, Element>,
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
      scrollRef: Ref<HTMLElement | undefined>;
      listRef: Ref<HTMLElement | undefined>;
    }
  >,
) => {
  const virtualizer = useVirtualizer(
    computed(() => {
      const { items, estimateSize, scrollRef, listRef, ...virtualizerOptions } = unref(config);
      return {
        getScrollElement: () => scrollRef.value ?? null,
        count: items.length,
        estimateSize: (index) => estimateSize(items[index]),
        overscan: 5,
        initialOffset: scrollRef.value?.scrollTop ?? 0,
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
