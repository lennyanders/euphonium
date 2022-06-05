import { parse } from 'regexparam';
import { $, useSample, useReadonly } from 'voby';

const exec = (path: string, result: { keys: string[]; pattern: RegExp }) => {
  const matches = result.pattern.exec(path)!;
  return matches.slice(1).reduce<Record<string, string | null>>((res, val, index) => {
    res[result.keys[index]] = val ? decodeURIComponent(val) : null;
    return res;
  }, {});
};

const _params$ = $<Record<string, string | null>>({});
export const params$ = useReadonly(_params$);
const _path$ = $(location.pathname);
export const path$ = useReadonly(_path$);
let updateUrl = false;

let scrollY = 0;
const restoreScrollPosition = () => {
  window.scrollTo({ top: scrollY });
  scrollY = 0;
};

const updatePage = (path: string) => {
  history.replaceState({ scrollY: window.scrollY }, '');

  // @ts-ignore
  if (!document.createDocumentTransition) {
    _path$(path);
    restoreScrollPosition();
    return;
  }

  document.documentElement.classList.add('transition-warming-up');
  // @ts-ignore
  const transition = document.createDocumentTransition();
  transition.start(() => {
    _path$(path);
    restoreScrollPosition();
    document.documentElement.classList.remove('transition-warming-up');
  });
};

addEventListener('popstate', ({ state }) => {
  scrollY = typeof state?.scrollY === 'number' ? state.scrollY : 0;
  updatePage(location.pathname);
});

export const Router = ({
  routes,
}: {
  routes: { path: string; component: JSX.Child; title?: string }[];
}) => {
  const parsedRoutes = routes.map((route) => ({ ...route, regex: parse(route.path) }));
  return () => {
    const p = _path$();
    const route = parsedRoutes.find((route) => route.regex.pattern.test(p) || route.path === '*');
    if (updateUrl) {
      const url = new URL(location.href);
      url.pathname = p;
      history.pushState(null, '', url);
      updateUrl = false;
    }
    if (!route) return;

    _params$(exec(p, route.regex));
    return route.component;
  };
};

export const RouterLink = (props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const el$ = $<HTMLAnchorElement>();
  props.onClick = (event: MouseEvent) => {
    const anchor = useSample(el$);
    if (!anchor || anchor.origin !== location.origin) return;

    event.preventDefault();
    updateUrl = true;
    updatePage(anchor.pathname);
  };
  return <a ref={el$} {...props}></a>;
};
