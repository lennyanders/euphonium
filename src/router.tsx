import { parse } from 'regexparam';
import { $, useComputed, useSample } from 'voby';

const exec = (path: string, result: { keys: string[]; pattern: RegExp }) => {
  const matches = result.pattern.exec(path)!;
  return matches.slice(1).reduce<Record<string, string | null>>((res, val, index) => {
    res[result.keys[index]] = val ? decodeURIComponent(val) : null;
    return res;
  }, {});
};

export const params = $<Record<string, string | null>>({});
const path = $(location.pathname);
let updateUrl = false;

addEventListener('popstate', () => path(location.pathname));

export const Router = ({
  routes,
}: {
  routes: { path: string; component: JSX.Child; title?: string }[];
}) => {
  const parsedRoutes = routes.map((route) => ({ ...route, regex: parse(route.path) }));
  return useComputed(() => {
    const p = path();
    const route = parsedRoutes.find((route) => route.regex.pattern.test(p) || route.path === '*');
    if (updateUrl) {
      const url = new URL(location.href);
      url.pathname = p;
      history.pushState(null, '', url);
      updateUrl = false;
    }
    if (!route) return;

    // I don't like it but it fixes some weird error where voby can't remove a htmlelement
    requestAnimationFrame(() => params(exec(p, route.regex)));
    return route.component;
  });
};

export const RouterLink = (props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const el = $<HTMLAnchorElement>();
  props.onClick = (event: MouseEvent) => {
    const anchor = useSample(el);
    if (!anchor || anchor.origin !== location.origin) return;

    event.preventDefault();
    updateUrl = true;
    path(anchor.pathname);
  };
  return <a ref={el} {...props}></a>;
};
