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

addEventListener('popstate', () => _path$(location.pathname));

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
    _path$(anchor.pathname);
  };
  return <a ref={el$} {...props}></a>;
};
