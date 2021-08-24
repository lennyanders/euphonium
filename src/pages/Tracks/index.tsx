import { useContext } from 'preact/hooks';
import { Store } from '../../store';
import { trackClass, artistClass } from './index.css';

export const Tracks = ({}: { path: string }) => {
  const { tracks } = useContext(Store)!;

  return (
    <>
      <h1>Tracks ({tracks.length})</h1>
      <ul class=''>
        {tracks.map((track) => {
          return (
            <li key={track.id} class={trackClass}>
              <span>{track.title || track.fileName}</span>
              <small class={artistClass}>{track.artist || 'Unknown artist'}</small>
            </li>
          );
        })}
      </ul>
    </>
  );
};
