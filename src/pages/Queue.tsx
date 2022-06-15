import { TrackList } from '../components/TrackList';
import { queue$ } from '../modules/player';

export const Queue = () => (
  <>
    <h1>Queue</h1>
    <TrackList trackIds={queue$} stickToActiveTrack />
  </>
);
