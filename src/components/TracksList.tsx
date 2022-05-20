import { For, If, Observable } from 'voby';
import { play } from '../stores/player';
import { Track } from '../worker/database';

export const TracksList = ({ tracks }: { tracks: Track[] | Observable<Track[]> }) => {
  return (
    <ul class='grid gap-2'>
      <For values={tracks}>
        {(track) => (
          <li class='flex' onClick={() => play(track)}>
            <div>
              {track.title || track.fileName}
              <If when={track.artist}>
                <small class='block'>{track.artist}</small>
              </If>
            </div>
          </li>
        )}
      </For>
    </ul>
  );
};
