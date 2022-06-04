import { pause, play, playing$ } from '../../modules/player';

export const PlayPause = () => (
  <button
    onClick={() => (playing$() ? pause() : play())}
    class={['m-4 w-8 h-8', () => (playing$() ? 'i-mdi-pause' : 'i-mdi-play')]}
  />
);
