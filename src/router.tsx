import { parse } from 'regexparam';
import { $, useReadonly, store, batch, useEffect, $$ } from 'voby';

export type Params = Record<string, string | null>;

const exec = (path: string, result: { keys: string[]; pattern: RegExp }) => {
  const matches = result.pattern.exec(path)!;
  return matches.slice(1).reduce<Params>((res, val, index) => {
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
    for (const key in store.unwrap(queryParams)) delete queryParams[key];
    Object.assign(queryParams, getQueryParams());
  });
};
useEffect(() => {
  const url = new URL(location.href);
  url.searchParams.forEach((_val, key) => url.searchParams.delete(key));
  for (const key in queryParams) url.searchParams.set(key, queryParams[key]);
  if (url.href !== location.href) history.pushState(null, '', url);
});

export const params = store<Params>({});
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
  _path$(path);
  restoreScrollPosition();
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
    | {
        path: string;
        component: JSX.Child;
        title?: string | ((params: Params) => string);
      }
    | { path: string; redirect: string }
  )[];
}) => {
  const parsedRoutes = routes.map((route) => ({ ...route, regex: parse(route.path) }));

  const component$ = $<JSX.Child>();

  useEffect(() => {
    const p = $$(_path$);
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

    const newParams = exec(p, route.regex);
    if (typeof route.title === 'string') {
      document.title = route.title;
    } else if (typeof route.title === 'function') {
      document.title = route.title(newParams);
    }

    batch(() => {
      for (const key in store.unwrap(params)) delete params[key];
      Object.assign(params, newParams);
      updateQueryParams();
    });

    component$(route.component);
  });

  return component$;
};

export const RouterLink = (props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const el$ = $<HTMLAnchorElement>();
  props.onClick = (event: MouseEvent) => {
    const anchor = $$(el$);
    if (!anchor || anchor.origin !== location.origin) return;

    event.preventDefault();
    go(anchor.pathname);
  };
  return <a ref={el$} {...props}></a>;
};
