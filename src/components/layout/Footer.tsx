import { path$, RouterLink } from '../../router';
import { currentTrack$, pause, play, playing$ } from '../../modules/player';
import { If } from 'voby';

const MiniPlayer = () => () => {
  const track = currentTrack$();
  if (!track) return;
  return (
    <div class='w-64 flex items-center'>
      <button
        onClick={() => (playing$() ? pause() : play())}
        class={() => ['m-4 w-8 h-8', playing$() ? 'i-mdi-pause' : 'i-mdi-play']}
      />
      <RouterLink href='/player' class='flex-1'>
        <span class='truncate'>{track.title}</span>
        <small class='truncate block'>{track.artist}</small>
      </RouterLink>
    </div>
  );
};

export const Footer = () => {
  return (
    <div
      class='fixed right-2 max-w-[calc(100%-1rem)] flex items-center bottom-4 bg-[#111]'
      onTouchStart={(e) => e.stopImmediatePropagation()}
    >
      <If when={() => path$() !== '/player' && currentTrack$()}>
        <div class='w-64 flex items-center'>
          <button
            onClick={() => (playing$() ? pause() : play())}
            class={() => ['m-4 w-8 h-8', playing$() ? 'i-mdi-pause' : 'i-mdi-play']}
          />
          <RouterLink href='/player' class='flex-1 grid'>
            <span class='truncate'>{() => currentTrack$()?.title}</span>
            <small class='truncate block'>{() => currentTrack$()?.artist}</small>
          </RouterLink>
        </div>
      </If>
      <RouterLink href='/'>
        <div class='m-4 w-8 h-8 i-mdi-view-grid-outline'></div>
      </RouterLink>
    </div>
  );
};
