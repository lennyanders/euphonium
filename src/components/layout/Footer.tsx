import { $, useEventListener } from 'voby';
import { RouterLink } from '../../router';

export const Footer = () => {
  const menuOpen = $(false);

  useEventListener(document, 'touchstart', () => menuOpen(false));

  return (
    <div
      class='fixed left-4 right-4 bottom-4 bg-[#111]'
      onTouchStart={(e) => e.stopImmediatePropagation()}
    >
      {/* player */}
      <nav class='flex justify-between p-4 bg-inherit relative z-1'>
        <RouterLink href='/'>home</RouterLink>
        <RouterLink href='/search'>search</RouterLink>
        <button onClick={() => menuOpen((v) => !v)}>menu</button>
      </nav>
      <div
        onClick={() => menuOpen(false)}
        class={() =>
          `absolute bottom-100% w-100% bg-inherit transition-200 p-4 ${
            menuOpen() ? '' : 'translate-y-100% opacity-0 pointer-events-none'
          }`
        }
      >
        <RouterLink href='/settings'>Settings</RouterLink>
      </div>
    </div>
  );
};
