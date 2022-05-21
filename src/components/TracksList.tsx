import { For, If, Observable } from 'voby';
import { play } from '../stores/player';
import { Track } from '../worker/database';

export const TracksList = ({
  tracks,
  displayNumber,
}: {
  tracks: Track[] | Observable<Track[]>;
  displayNumber?: boolean;
}) => {
  return (
    <ul class='grid gap-2'>
      <For values={tracks}>
        {(track) => (
          <>
            <If when={track.displayDiskNumber}>
              <li>Disk: {track.diskNumber}</li>
            </If>
            <li class='flex gap-2 items-center' onClick={() => play(track)}>
              <If when={displayNumber}>
                <span class='w-2ch text-center'>{track.number}</span>
              </If>
              <div>
                {track.title || track.fileName}
                <If when={track.artist}>
                  <small class='block'>{track.artist}</small>
                </If>
              </div>
            </li>
          </>
        )}
      </For>
    </ul>
  );
};
