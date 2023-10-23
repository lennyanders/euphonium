import { parse } from 'regexparam';
import { $, useReadonly, store, useEffect, $$ } from 'voby';

export type Params = Record<string, string | null>;

const cleanSetStore = <T,>(data: Record<string, T>, newData: Record<string, T>) => {
  for (const key in store.unwrap(data)) delete data[key];
  Object.assign(data, newData);
};

const exec = (path: string, result: { keys: string[]; pattern: RegExp }) => {
  const matches = result.pattern.exec(path)!;
  return matches.slice(1).reduce<Params>((res, val, index) => {
    res[result.keys[index]] = val ? decodeURIComponent(val) : null;
    return res;
  }, {});
};

const getQueryParams = () => {
  const newQueryParams: Record<string, string> = {};
  new URLSearchParams(location.search).forEach((val, key) => (newQueryParams[key] = val));
  return newQueryParams;
};
export const queryParams = store<Record<string, string>>(getQueryParams());

useEffect(() => {
  const url = new URL(location.href);
  url.search = new URLSearchParams(queryParams).toString();
  location.replace(url.href);
});

export const params = store<Params>({});
const _path$ = $(location.pathname);
export const path$ = useReadonly(_path$);

const scroll = (top: number) => window.scrollTo({ top, behavior: 'instant' });

window.navigation?.addEventListener('navigate', (event) => {
  if (!event.canIntercept) return;

  window.navigation?.updateCurrentEntry({ state: { scrollY: window.scrollY } });

  const newUrl = new URL(event.destination.url);
  const pathChanged = location.pathname !== newUrl.pathname;

  event.intercept({
    scroll: 'manual',
    focusReset: pathChanged ? 'after-transition' : 'manual',
    async handler() {
      if (pathChanged) {
        _path$(location.pathname);
        const stateScrollY = (event.destination?.getState() as any)?.scrollY;
        if (typeof stateScrollY !== 'number') scroll(0);
        else requestAnimationFrame(() => scroll(stateScrollY));
      }
      if (location.search !== newUrl.search) {
        cleanSetStore(queryParams, getQueryParams());
      }
    },
  });
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
    if (!route) return;

    if ('redirect' in route) {
      location.replace(route.redirect);
      return;
    }

    const newParams = exec(p, route.regex);
    if (typeof route.title === 'string') {
      document.title = route.title;
    } else if (typeof route.title === 'function') {
      document.title = route.title(newParams);
    }

    cleanSetStore(params, newParams);

    component$(route.component);
  });

  return component$;
};
