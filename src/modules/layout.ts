import { $, $$, useEffect } from 'voby';

const useMatchMedia = (media: string) => {
  const matcher = matchMedia(media);
  const val$ = $(matcher.matches);
  matcher.addEventListener('change', ({ matches }) => val$(matches));
  return val$;
};

export const w640$ = useMatchMedia('(min-width: 640px)');
export const w1024$ = useMatchMedia('(min-width: 1024px)');

export const mainEl$ = $<HTMLElement>();
export const mainElWidth$ = $(0);
useEffect(() => {
  const mainEl = $$(mainEl$);
  if (!mainEl) return;
  const observer = new ResizeObserver(([el]) => mainElWidth$(el.contentRect.width));
  observer.observe(mainEl);
  return () => observer.disconnect();
});
