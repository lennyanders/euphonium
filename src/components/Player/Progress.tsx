import { $$, useMemo } from 'voby';

import { currentTime$, currentTrack$, seek } from '../../modules/player';
import { getFormattedTime } from '../../shared/utils';
import { Range } from './Range';

export const Progress = ({ bg, class: css }: { bg?: string; class?: JSX.Class }) => (
  <div class={['flex items-center gap-4', css]}>
    {() => getFormattedTime($$(currentTime$))}
    <Range
      max={useMemo(() => $$(currentTrack$)?.duration || 1)}
      val={currentTime$}
      seek={seek}
      bg={bg}
    />
    {() => $$(currentTrack$)?.durationFormatted || '00:00'}
  </div>
);
