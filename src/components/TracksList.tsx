import { For, Observable } from 'voby';
import { play } from '../stores/player';

export const TracksList = ({
  tracks,
  displayNumber,
}: {
  tracks: FETrack[] | Observable<FETrack[]>;
  displayNumber?: boolean;
}) => (
  <ul class='grid gap-2'>
    <For values={tracks}>
      {(track) => (
        <>
          {track.displayDiskNumber && <li>Disk: {track.diskNumber}</li>}
          <li class='flex gap-2 items-center' onClick={() => play(track)}>
            {displayNumber && <span class='w-2ch text-center'>{track.number}</span>}
            {track.cover ? (
              <img
                decoding='async'
                class='w-12 h-12 rounded-2 object-cover object-center'
                src={track.cover}
              />
            ) : (
              <div class='w-12 h-12 i-mdi-disk'></div>
            )}
            <div>
              {track.title}
              <small class='block'>{track.artist}</small>
            </div>
            <span class='m-l-a'>{track.durationFormatted}</span>
          </li>
        </>
      )}
    </For>
  </ul>
);
