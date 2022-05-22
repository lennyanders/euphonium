import { For, Observable } from 'voby';
import { play } from '../stores/player';
import { DbTrack } from '../worker/database';

export const TracksList = ({
  tracks,
  displayNumber,
}: {
  tracks: DbTrack[] | Observable<DbTrack[]>;
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
                src={URL.createObjectURL(track.cover)}
              />
            ) : (
              <div class='w-12 h-12 i-mdi-disk'></div>
            )}
            <div>
              {track.title || track.fileName}
              {track.artist && <small class='block'>{track.artist}</small>}
            </div>
          </li>
        </>
      )}
    </For>
  </ul>
);
