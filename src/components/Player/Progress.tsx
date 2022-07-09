import { Range } from './Range';
import { currentTime$, currentTrack$, seek } from '../../modules/player';
import { getFormattedTime } from '../../shared/utils';

export const Progress = ({ bg, class: css }: { bg?: string; class?: JSX.Class }) => (
  <div class={['flex items-center gap-4', css]}>
    {() => getFormattedTime(currentTime$())}
    <Range max={() => currentTrack$()?.duration || 1} val={currentTime$} seek={seek} bg={bg} />
    {() => currentTrack$()?.durationFormatted || '00:00'}
  </div>
);
