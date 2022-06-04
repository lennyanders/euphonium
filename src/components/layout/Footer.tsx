import { If, Ternary } from 'voby';
import { path$, RouterLink } from '../../router';
import {
  currentTime$,
  currentTrack$,
  go,
  isFirst$,
  isLast$,
  pause,
  play,
  playing$,
  seek,
} from '../../modules/player';
import { w1024$ } from '../../modules/layout';
import { CoverImage } from '../CoverImage';
import { getFormattedTime } from '../../shared/utils';
import { ProgressBar } from '../Player/ProgressBar';

const Desktop = () => (
  <>
    <div class='flex items-center gap-4 p-x-4 p-t-2 p-b-1'>
      {() => getFormattedTime(currentTime$())}
      <ProgressBar />
      {() => currentTrack$()?.durationFormatted}
    </div>
    <div class='flex items-center'>
      <div class='flex-1 flex gap-4 p-x-4'>
        <CoverImage
          src={() => currentTrack$()?.cover!}
          class='w-12 h-12 rd-1 shrink-0'
          fallbackCss='mask-size-125% mask-position-center c-[#333]'
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
      <div class='flex'>
        <button
          onClick={() => go(-1)}
          class='m-4 w-8 h-8 i-mdi-skip-previous-outline'
          disabled={isFirst$}
        />
        <button
          onClick={() => (playing$() ? pause() : play())}
          class={['m-4 w-8 h-8', () => (playing$() ? 'i-mdi-pause' : 'i-mdi-play')]}
        />
        <button
          onClick={() => go(1)}
          class='m-4 w-8 h-8 i-mdi-skip-next-outline'
          disabled={isLast$}
        />
      </div>
      <div class='flex-1 p-x-4 text-right'></div>
    </div>
  </>
);

const Mobile = () => (
  <>
    <If when={() => path$() !== '/player' && currentTrack$()}>
      <div class='w-64 flex items-center'>
        <button
          onClick={() => (playing$() ? pause() : play())}
          class={['m-4 w-8 h-8', () => (playing$() ? 'i-mdi-pause' : 'i-mdi-play')]}
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
