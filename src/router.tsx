import { $, useComputed } from 'voby';

const path = $(location.pathname);
let updateUrl = false;

addEventListener('popstate', () => path(location.pathname));

export const Router = ({
  routes,
}: {
  routes: { path: string; component: JSX.Child; title?: string }[];
}) => {
  return useComputed(() => {
    const p = path();
    const comp = routes.find((route) => route.path === p || route.path === '*')?.component;
    if (updateUrl) {
      const url = new URL(location.href);
      url.pathname = p;
      history.pushState(null, '', url);
      updateUrl = false;
    }
    return comp;
  });
};

export const RouterLink = (props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  props.onClick = (event: MouseEvent) => {
    const target = event.target as HTMLAnchorElement;
    if (target.origin !== location.origin) return;

    event.preventDefault();
    updateUrl = true;
    path(target.pathname);
  };
  return <a {...props}></a>;
};
