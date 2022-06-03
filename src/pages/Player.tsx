import { If } from 'voby';
import { CoverImage } from '../components/CoverImage';
import { TrackList } from '../components/TrackList';
import { RouterLink } from '../router';
import { getFormattedTime } from '../shared/utils';
import {
  currentTime$,
  currentTrack$,
  go,
  isFirst$,
  isLast$,
  pause,
  play,
  playing$,
  queue$,
  seek,
} from '../modules/player';
import { HeroImage } from '../components/HeroImage';
import { HeroImageMobilePlayer } from '../components/HeroImage/MobilePlayer';

export const Player = () => {
  return (
    <If when={currentTrack$}>
      {() => (
        <HeroImage
          image={currentTrack$()?.cover}
          title={currentTrack$()?.title}
          sublines={[
            <RouterLink href={`/artist/${encodeURIComponent(currentTrack$()?.artist!)}`}>
              {currentTrack$()?.artist}
            </RouterLink>,
          ]}
          mobileComp={HeroImageMobilePlayer}
        />
      )}
      <div class='flex justify-between'>
        <span>{() => getFormattedTime(currentTime$())}</span>
        <span>{() => currentTrack$()?.durationFormatted}</span>
      </div>
      <div class='relative'>
        <div
          class='h-2 bg-red transform-origin-l'
          style={{
            transform: () => `scaleX(${currentTime$() / currentTrack$()?.duration!})`,
          }}
        />
        <input
          class='absolute top-0 left-0 w-100% h-100% m-0 op-0'
          type='range'
          min='0'
          max={() => currentTrack$()?.duration || 0}
          onInput={(event) => seek((event.target as any).value)}
        />
      </div>
      <div class='flex justify-center'>
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
      <div>Queue</div>
      {() => <TrackList tracks={queue$() || []} />}
    </If>
  );
};
