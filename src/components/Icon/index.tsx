import { icon } from './index.css';

export const Icon = ({ path }: { path: string }) => (
  <svg viewBox='0 0 24 24' class={icon}>
    <path d={path}></path>
  </svg>
);
