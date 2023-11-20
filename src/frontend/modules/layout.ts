import { ref, watchEffect } from 'vue';

const useMatchMedia = (media: string) => {
  const matcher = matchMedia(media);
  const value = ref(matcher.matches);
  matcher.addEventListener('change', ({ matches }) => (value.value = matches));
  return value;
};

export const w640 = useMatchMedia('(min-width: 640px)');
export const w1024 = useMatchMedia('(min-width: 1024px)');

export const mainEl = ref<HTMLElement>();
export const mainElWidth = ref(0);
watchEffect((onCleanup) => {
  if (!mainEl.value) return;

  const observer = new ResizeObserver(([el]) => (mainElWidth.value = el.contentRect.width));
  observer.observe(mainEl.value);
  onCleanup(() => observer.disconnect());
});
