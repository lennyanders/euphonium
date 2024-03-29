import { useMemo } from 'voby';

import { state } from '../../modules/library';
import { postMessage } from '../../utils/worker';
import { Range } from '../Player/Range';

export const volumeIcon$ = useMemo(() => {
  if (state.mute) return 'i-mdi-volume-mute';
  if (state.volume === undefined || state.volume > 0.66) return 'i-mdi-volume';
  if (state.volume > 0.33) return 'i-mdi-volume-medium';
  return 'i-mdi-volume-low';
});

export const Slider = ({ class: css, bg }: { class?: string; bg?: string }) => (
  <Range
    max={1}
    val={() => (state.volume !== undefined ? state.volume : 1)}
    seek={(volume) => postMessage({ message: 'setGeneralData', state: { volume, mute: false } })}
    bg={bg}
    class={css}
  />
);

export const VolumeDesktop = () => (
  <div class='flex flex-row-reverse items-center'>
    <button
      onClick={() => postMessage({ message: 'setGeneralData', state: { mute: !state.mute } })}
      class={['w-8 h-8 next:(hover:(opacity-100 pointer-events-auto))', volumeIcon$]}
    />
    <div class='p-2 transition-opacity opacity-0 pointer-events-none hover:(opacity-100 pointer-events-auto)'>
      <Slider class='w-32' />
    </div>
  </div>
);
