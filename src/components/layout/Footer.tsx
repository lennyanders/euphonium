import { If, Ternary, useComputed } from 'voby';
import { path$, RouterLink } from '../../router';
import { currentTrack$ } from '../../modules/player';
import { w1024$ } from '../../modules/layout';
import { CoverImage } from '../CoverImage';
import { MainControls } from '../Player/MainControls';
import { Progress } from '../Player/Progress';
import { PlayPause } from '../Player/PlayPause';
import { Range } from '../Player/Range';
import { state } from '../../modules/library';

const volumeIcon$ = useComputed(() => {
  if (state.volume === undefined || state.volume > 0.66) return 'i-mdi-volume';
  if (state.volume > 0.33) return 'i-mdi-volume-medium';
  return 'i-mdi-volume-low';
});

const Desktop = () => (
  <>
    <Progress css='p-x-4 p-t-2 p-b-1' />
    <div class='flex items-center'>
      <div class='flex-1 flex gap-4 p-x-4 truncate'>
        <CoverImage
          src={() => currentTrack$()?.cover!}
          css='w-12 h-12 rd-1 shrink-0 background-size-125%'
        />
        <div class='truncate'>
          {() => currentTrack$()?.title}
          <small class='truncate block'>
            <RouterLink href={() => `/artist/${encodeURIComponent(currentTrack$()?.artist!)}`}>
              {() => currentTrack$()?.artist}
            </RouterLink>
          </small>
        </div>
      </div>
      <MainControls />
      <div class='flex-1 flex justify-end p-x-4'>
        <div class='flex flex-row-reverse items-center'>
          <button class={['w-8 h-8 next:(hover:(opacity-100 pointer-events-auto))', volumeIcon$]} />
          <div class='p-2 transition-opacity opacity-0 pointer-events-none hover:(opacity-100 pointer-events-auto)'>
            <Range
              max={1}
              val={() => (state.volume !== undefined ? state.volume : 1)}
              seek={(newVal) => (state.volume = newVal)}
              css='w-32'
            />
          </div>
        </div>
      </div>
    </div>
  </>
);

const Mobile = () => (
  <>
    <If when={() => path$() !== '/player' && currentTrack$()}>
      <div class='w-64 flex items-center'>
        <PlayPause css='m-4' />
        <RouterLink href='/player' class='flex-1 grid'>
          <span class='truncate'>{() => currentTrack$()?.title}</span>
          <small class='truncate block'>{() => currentTrack$()?.artist}</small>
        </RouterLink>
      </div>
    </If>
    <RouterLink href='/'>
      <div class='m-4 w-8 h-8 i-mdi-view-grid-outline'></div>
    </RouterLink>
  </>
);

export const Footer = () => (
  <div class='fixed right-2 max-w-[calc(100%-1rem)] lg:left-2 rd-2 flex items-center lg:block bottom-4 bg-[#111]'>
    <Ternary when={w1024$}>
      <Desktop />
      <Mobile />
    </Ternary>
  </div>
);
