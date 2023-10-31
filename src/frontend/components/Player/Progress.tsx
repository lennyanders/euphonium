import { $$, useMemo } from 'voby';

import { getFormattedTime } from '../../../shared/utils';
import { state } from '../../modules/library';
import { currentTrack$, seek } from '../../modules/player';
import { Range } from './Range';

export const Progress = ({ bg, class: css }: { bg?: string; class?: JSX.Class }) => (
  <div class={['flex items-center gap-4', css]}>
    {() => getFormattedTime(state.currentTime || 0)}
    <Range
      max={useMemo(() => $$(currentTrack$)?.duration || 1)}
      val={() => state.currentTime || 0}
      seek={seek}
      bg={bg}
    />
    {() => $$(currentTrack$)?.durationFormatted || '00:00'}
  </div>
);
