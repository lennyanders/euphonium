import { Ternary } from 'voby';

import { TrackList } from '../components/TrackList';
import { cleanQueue$ } from '../modules/library';

export const Queue = () => [
  <h1>Queue</h1>,
  <Ternary when={() => cleanQueue$().length}>
    <TrackList trackIds={cleanQueue$} stickToActiveTrack showIndex />
    Your queue is empty
  </Ternary>,
];
