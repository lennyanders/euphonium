import { parse } from 'regexparam';
import { $, useReadonly, store, batch, useEffect } from 'voby';

import { uw } from './utils';

const exec = (path: string, result: { keys: string[]; pattern: RegExp }) => {
  const matches = result.pattern.exec(path)!;
  return matches.slice(1).reduce<Record<string, string | null>>((res, val, index) => {
    res[result.keys[index]] = val ? decodeURIComponent(val) : null;
    return res;
  }, {});
};

const getQueryParams = () => {
  const newQueryParams: Record<string, string> = {};
  const params = new URLSearchParams(location.search);
  params.forEach((val, key) => (newQueryParams[key] = val));
  return newQueryParams;
};
export const queryParams = store<Record<string, string>>(getQueryParams());
const updateQueryParams = () => {
  batch(() => {
    for (const key in uw(queryParams)) delete queryParams[key];
    Object.assign(queryParams, getQueryParams());
  });
};
useEffect(() => {
  const url = new URL(location.href);
  url.searchParams.forEach((_val, key) => url.searchParams.delete(key));
  for (const key in queryParams) url.searchParams.set(key, queryParams[key]);
  if (url.href !== location.href) history.pushState(null, '', url);
});

export const params = store<Record<string, string | null>>({});
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

export const go = (path: string) => {
  updateUrl = true;
  updatePage(path);
};

addEventListener('popstate', ({ state }) => {
  scrollY = typeof state?.scrollY === 'number' ? state.scrollY : 0;
  updatePage(location.pathname);
  updateQueryParams();
});

export const Router = ({
  routes,
}: {
  routes: (
    | { path: string; component: JSX.Child; title?: string }
    | { path: string; redirect: string }
  )[];
}) => {
  const parsedRoutes = routes.map((route) => ({ ...route, regex: parse(route.path) }));
  return () => {
    const p = _path$();
    const route = parsedRoutes.find((route) => route.regex.pattern.test(p) || route.path === '*');
    if (updateUrl) {
      const url = new URL(location.href);
      history.pushState(null, '', Object.assign(url, { pathname: p, search: '' }));
      updateUrl = false;
    }
    if (!route) return;
    if ('redirect' in route) {
      go(route.redirect);
      return;
    }

    batch(() => {
      for (const key in uw(params)) delete params[key];
      Object.assign(params, exec(p, route.regex));
      updateQueryParams();
    });

    return route.component;
  };
};

export const RouterLink = (props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const el$ = $<HTMLAnchorElement>();
  props.onClick = (event: MouseEvent) => {
    const anchor = el$();
    if (!anchor || anchor.origin !== location.origin) return;

    event.preventDefault();
    go(anchor.pathname);
  };
  return <a ref={el$} {...props}></a>;
};
