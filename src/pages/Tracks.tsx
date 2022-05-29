import { TrackList } from '../components/TrackList';
import { RouterLink } from '../router';
import { tracks$ } from '../modules/library';

export const Tracks = () => {
  const tracks = tracks$();
  return (
    <>
      <h1>Tracks</h1>
      {!tracks?.length ? (
        <p>
          Add directories in the{' '}
          <RouterLink href='/settings' class='underline'>
            settings
          </RouterLink>{' '}
          and start listening to music!
        </p>
      ) : (
        <TrackList tracks={tracks} />
      )}
    </>
  );
};
