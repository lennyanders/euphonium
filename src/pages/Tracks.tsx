import { For, If } from 'voby';
import { RouterLink } from '../router';
import { store } from '../store';

export const Tracks = () => {
  const { tracks } = store();

  return (
    <div>
      <h1>Tracks ({tracks.length})</h1>
      <If
        when={tracks.length}
        fallback={
          <p>
            Add directories in the{' '}
            <RouterLink href='/settings' class='underline'>
              settings
            </RouterLink>{' '}
            and start listening to music!
          </p>
        }
      >
        <ul class='m-t-4 grid gap-2'>
          <For values={tracks}>
            {(track) => (
              <li class='flex'>
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
      </If>
    </div>
  );
};
