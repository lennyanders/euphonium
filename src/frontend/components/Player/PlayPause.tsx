import { ternary } from 'oby';

import { state } from '../../modules/library';
import { pause, play } from '../../modules/player';

export const PlayPause = ({ class: css }: { class?: JSX.Class }) => (
  <button
    onClick={() => (state.playing ? pause() : play())}
    class={['w-8 h-8', ternary(() => state.playing, 'i-mdi-pause', 'i-mdi-play'), css]}
  />
);
