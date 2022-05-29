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
} from '../modules/player';

export const Player = () => {
  return (
    <If when={currentTrack$}>
      <div class='relative'>
        <CoverImage src={() => currentTrack$()?.cover!} class='w-100% rd-2' />
        <div class='absolute left-3 right-3 bottom-3 flex flex-col items-start gap-1'>
          <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate'>
            {() => currentTrack$()?.title}
          </span>
          <small class='p-x-1 flex items-center bg-[#000D] rd-1 max-w-100% truncate'>
            {() => (
              <RouterLink href={`/artist/${encodeURIComponent(currentTrack$()?.artist!)}`}>
                {currentTrack$()?.artist}
              </RouterLink>
            )}
          </small>
        </div>
      </div>
      <div class='flex justify-between'>
        <span>{() => getFormattedTime(currentTime$())}</span>
        <span>{() => currentTrack$()?.durationFormatted}</span>
      </div>
      <div>
        <div
          class='h-2 bg-red transform-origin-l'
          style={{
            transform: () => `scaleX(${currentTime$() / currentTrack$()?.duration!})`,
          }}
        />
      </div>
      <div class='flex justify-center'>
        <button
          onClick={() => go(-1)}
          class={() => ['m-4 w-8 h-8 i-mdi-skip-previous-outline']}
          disabled={isFirst$}
        />
        <button
          onClick={() => (playing$() ? pause() : play())}
          class={() => ['m-4 w-8 h-8', playing$() ? 'i-mdi-pause' : 'i-mdi-play']}
        />
        <button
          onClick={() => go(1)}
          class={() => ['m-4 w-8 h-8 i-mdi-skip-next-outline']}
          disabled={isLast$}
        />
      </div>
      <div>Queue</div>
      {() => <TrackList tracks={queue$() || []} />}
    </If>
  );
};
