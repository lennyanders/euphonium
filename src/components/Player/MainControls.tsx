import { useMemo } from 'voby';
import { state } from '../../modules/library';
import { go, isFirst$, isLast$, shuffle } from '../../modules/player';
import { PlayPause } from './PlayPause';

const loopIcon$ = useMemo(() => {
  if (state.loop === 'track') return 'i-mdi-repeat-once';
  if (state.loop === 'queue') return 'i-mdi-repeat';
  return 'i-mdi-repeat-off op-50';
});

const getNextLoopMode = (): typeof state.loop => {
  if (state.loop === 'track') return 'none';
  if (state.loop === 'queue') return 'track';
  return 'queue';
};

const isLoop$ = useMemo(() => !!state.loop && state.loop !== 'none');

export const MainControls = () => (
  <div class='p-4 flex gap-4 justify-center items-center'>
    <button
      onClick={() => (state.loop = getNextLoopMode())}
      class={['w-6 h-6 transition-opacity', loopIcon$]}
    />
    <button
      onClick={() => go(-1)}
      class='w-8 h-8 i-mdi-skip-previous-outline'
      disabled={() => !isLoop$() && isFirst$()}
    />
    <PlayPause />
    <button
      onClick={() => go(1)}
      class='w-8 h-8 i-mdi-skip-next-outline'
      disabled={() => !isLoop$() && isLast$()}
    />
    <button
      onClick={() => shuffle(!state.shuffle)}
      class={['w-6 h-6 i-mdi-shuffle transition-opacity', () => !state.shuffle && 'op-50']}
    />
  </div>
);
