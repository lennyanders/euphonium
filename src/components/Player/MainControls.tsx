import { go, isFirst$, isLast$, pause, play, playing$ } from '../../modules/player';

export const MainControls = () => (
  <div class='flex justify-center'>
    <button
      onClick={() => go(-1)}
      class='m-4 w-8 h-8 i-mdi-skip-previous-outline'
      disabled={isFirst$}
    />
    <button
      onClick={() => (playing$() ? pause() : play())}
      class={['m-4 w-8 h-8', () => (playing$() ? 'i-mdi-pause' : 'i-mdi-play')]}
    />
    <button onClick={() => go(1)} class='m-4 w-8 h-8 i-mdi-skip-next-outline' disabled={isLast$} />
  </div>
);
