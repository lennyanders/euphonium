import { $, useComputed } from 'voby';

const path = $(location.pathname);

export const Router = ({
  routes,
}: {
  routes: { path: string; component: JSX.Child; title?: string }[];
}) => {
  return useComputed(() => {
    const p = path();
    const comp = routes.find((route) => route.path === p || route.path === '*')?.component;
    const url = new URL(location.href);
    url.pathname = p;
    history.pushState(null, '', url);
    return comp;
  });
};

export const RouterLink = (props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  props.onClick = (event: MouseEvent) => {
    const target = event.target as HTMLAnchorElement;
    if (target.origin !== location.origin) return;

    event.preventDefault();
    path(target.pathname);
  };
  return <a {...props}></a>;
};
