import { TracksList } from '../components/TracksList';
import { RouterLink } from '../router';
import { library } from '../stores/library';

export const Tracks = () => {
  const { tracks } = library();

  return (
    <>
      <h1>Tracks ({tracks.length})</h1>
      {!tracks.length ? (
        <p>
          Add directories in the{' '}
          <RouterLink href='/settings' class='underline'>
            settings
          </RouterLink>{' '}
          and start listening to music!
        </p>
      ) : (
        <TracksList tracks={tracks} />
      )}
    </>
  );
};
