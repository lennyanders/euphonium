import { $ } from 'voby';

const w640Matcher = matchMedia('(min-width: 640px)');
export const w640$ = $(w640Matcher.matches);
w640Matcher.addEventListener('change', ({ matches }) => w640$(matches));
