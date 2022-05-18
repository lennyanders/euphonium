import { $ } from 'voby';

export const Footer = () => {
  const menuOpen = $(true);

  return (
    <div class='absolute left-4 right-4 bottom-4 bg-[#111]'>
      {/* player */}
      <nav class='flex justify-between p-4 bg-inherit relative z-1'>
        <a href='/'>home</a>
        <a href='/search'>search</a>
        <button onClick={() => menuOpen((v) => !v)}>menu</button>
      </nav>
      <div
        class={() =>
          `absolute bottom-100% w-100% bg-inherit transition-200 p-4 ${
            menuOpen() ? 'translate-y-100% opacity-0 pointer-events-none' : ''
          }`
        }
      >
        <a href='/settings'>Settings</a>
      </div>
    </div>
  );
};
