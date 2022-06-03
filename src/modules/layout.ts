import { $ } from 'voby';

const useMatchMedia = (media: string) => {
  const matcher = matchMedia(media);
  const val$ = $(matcher.matches);
  matcher.addEventListener('change', ({ matches }) => val$(matches));
  return val$;
};

export const w640$ = useMatchMedia('(min-width: 640px)');
export const w1024$ = useMatchMedia('(min-width: 1024px)');
