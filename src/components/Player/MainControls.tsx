import { state } from '../../modules/library';
import { go, isFirst$, isLast$ } from '../../modules/player';
import { PlayPause } from './PlayPause';

export const MainControls = () => (
  <div class='p-4 flex gap-4 justify-center items-center'>
    <button
      onClick={() => go(-1)}
      class='w-8 h-8 i-mdi-skip-previous-outline'
      disabled={isFirst$}
    />
    <PlayPause />
    <button onClick={() => go(1)} class='w-8 h-8 i-mdi-skip-next-outline' disabled={isLast$} />
    <button
      onClick={() => (state.shuffle = !state.shuffle)}
      class={['w-6 h-6 i-mdi-shuffle transition-opacity', () => !state.shuffle && 'op-50']}
    />
  </div>
);
