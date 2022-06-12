import { FunctionMaybe } from 'voby';
import { pause, play, playing$ } from '../../modules/player';

export const PlayPause = ({ css }: { css?: FunctionMaybe<string> }) => (
  <button
    onClick={() => (playing$() ? pause() : play())}
    class={['w-8 h-8', () => (playing$() ? 'i-mdi-pause' : 'i-mdi-play'), css]}
  />
);
