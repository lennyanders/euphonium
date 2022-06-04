import { go, isFirst$, isLast$ } from '../../modules/player';
import { PlayPause } from './PlayPause';

export const MainControls = () => (
  <div class='flex justify-center'>
    <button
      onClick={() => go(-1)}
      class='m-4 w-8 h-8 i-mdi-skip-previous-outline'
      disabled={isFirst$}
    />
    <PlayPause />
    <button onClick={() => go(1)} class='m-4 w-8 h-8 i-mdi-skip-next-outline' disabled={isLast$} />
  </div>
);
