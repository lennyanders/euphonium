import { RouterLink } from '../../router';
import { currentTrack, pause, play, playing } from '../../stores/player';

const MiniPlayer = () => () => {
  const track = currentTrack();
  if (!track) return;
  return (
    <div class='flex-1 flex items-center'>
      <button
        onClick={() => (playing() ? pause() : play())}
        class={() => ['m-4 w-8 h-8', playing() ? 'i-mdi-pause' : 'i-mdi-play']}
      />
      <div>
        <span class='truncate'>{track.title}</span>
        <small class='truncate block'>{track.artist}</small>
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <div
      class='fixed right-2 w-76 max-w-[calc(100%-0.5rem)] flex items-center bottom-4 bg-[#111]'
      onTouchStart={(e) => e.stopImmediatePropagation()}
    >
      <MiniPlayer />
      <RouterLink href='/'>
        <div class='m-4 w-8 h-8 i-mdi-view-grid-outline'></div>
      </RouterLink>
    </div>
  );
};
