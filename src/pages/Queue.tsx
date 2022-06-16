import { useComputed } from 'voby';
import { TrackList } from '../components/TrackList';
import { state } from '../modules/library';

export const Queue = () => (
  <>
    <h1>Queue</h1>
    <TrackList trackIds={useComputed(() => state.queue || [])} stickToActiveTrack />
  </>
);
