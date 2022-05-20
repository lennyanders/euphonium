import { For, If } from 'voby';
import { RouterLink } from '../router';
import { library } from '../stores/library';
import { Track } from '../worker/database';

export const Tracks = () => {
  const { tracks } = library();

  const onClick = async (track: Track) => {
    try {
      const file = await track.fileHandle.getFile();
      console.log(track);
      console.log(file);
      new Audio(URL.createObjectURL(file)).play();
    } catch (_) {
      await track.fileHandle.requestPermission();
      onClick(track);
    }
  };

  return (
    <>
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
              <li class='flex' onClick={() => onClick(track)}>
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
    </>
  );
};
