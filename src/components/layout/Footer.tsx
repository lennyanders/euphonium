import { $, useEventListener } from 'voby';
import { RouterLink } from '../../router';
import { currentTrack, pause, play, playing } from '../../stores/player';

const MiniPlayer = () => () => {
  const track = currentTrack();
  if (!track) return;
  const isPlaying = playing();
  return (
    <div class='p-y-2 p-x-4 flex gap-2 items-center bg-inherit relative z-1'>
      <button onClick={() => (isPlaying ? pause() : play())}>{isPlaying ? 'Pause' : 'Play'}</button>
      <div>
        <span class='truncate'>{track.title}</span>
        <small class='truncate block'>{track.artist}</small>
      </div>
    </div>
  );
};

export const Footer = () => {
  const menuOpen = $(false);

  useEventListener(document, 'touchstart', () => menuOpen(false));

  return (
    <div
      class='fixed left-2 right-2 bottom-4 bg-[#111]'
      onTouchStart={(e) => e.stopImmediatePropagation()}
    >
      <MiniPlayer />
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
