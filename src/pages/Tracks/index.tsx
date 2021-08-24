import { useContext } from 'preact/hooks';
import { BasicTrackInfo } from '../../components/BasicTrackInfo';
import { Store } from '../../store';
import { trackClass } from './index.css';

export const Tracks = ({}: { path: string }) => {
  const { tracks } = useContext(Store)!;

  return (
    <>
      <h1>Tracks ({tracks.length})</h1>
      <ul class=''>
        {tracks.map((track) => {
          return (
            <li key={track.id} class={trackClass}>
              <BasicTrackInfo track={track} />
            </li>
          );
        })}
      </ul>
    </>
  );
};
