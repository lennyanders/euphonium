import { $$, If, Ternary } from 'voby';

import { w1024$ } from '../../modules/layout';
import { currentTrack$ } from '../../modules/player';
import { path$ } from '../../router';
import { CoverImage } from '../CoverImage';
import { MainControls } from '../Player/MainControls';
import { PlayPause } from '../Player/PlayPause';
import { Progress } from '../Player/Progress';
import { VolumeDesktop } from '../Player/Volume';
import { Toasts } from '../Toasts';

const Desktop = () => [
  <Progress class='p-x-4 p-t-2 p-b-1' />,
  <div class='flex items-center'>
    <div class='flex-1 flex gap-4 p-x-4 truncate'>
      <CoverImage
        src={() => $$(currentTrack$)?.images?.small!}
        class='w-12 h-12 rd-1 shrink-0 background-size-125%'
      />
      <div class='truncate'>
        {() => $$(currentTrack$)?.title}
        <small class='truncate block'>
          <a href={() => `/artist/${encodeURIComponent($$(currentTrack$)?.artist!)}`}>
            {() => $$(currentTrack$)?.artist}
          </a>
        </small>
      </div>
    </div>
    <MainControls />
    <div class='flex-1 flex gap-4 p-x-4 justify-end'>
      <VolumeDesktop />
      <Ternary when={() => $$(path$) === '/queue' && window.navigation?.canGoBack}>
        <button
          class='w-8 h-8 i-mdi-playlist-music-outline'
          onClick={() => window.navigation?.back()}
        />
        <a
          class='w-8 h-8 i-mdi-playlist-music-outline'
          href={() => ($$(path$) === '/queue' ? '../' : '/queue')}
        />
      </Ternary>
    </div>
  </div>,
];

const Mobile = () => [
  <Toasts class='absolute bottom-100% right-0 mb-4' />,
  <If when={() => $$(path$) !== '/player' && $$(currentTrack$)}>
    <div class='w-64 flex items-center'>
      <PlayPause class='m-4' />
      <a href='/player' class='flex-1 grid'>
        <span class='truncate'>{() => $$(currentTrack$)?.title}</span>
        <small class='truncate block'>{() => $$(currentTrack$)?.artist}</small>
      </a>
    </div>
  </If>,
  <a href='/'>
    <div class='m-4 w-8 h-8 i-mdi-view-grid-outline'></div>
  </a>,
];

export const Footer = () => (
  <div class='fixed right-2 max-w-[calc(100%-1rem)] lg:left-2 rd-2 flex items-center lg:block bottom-4 bg-dark-900'>
    <Ternary when={w1024$}>
      <Desktop />
      <Mobile />
    </Ternary>
  </div>
);
