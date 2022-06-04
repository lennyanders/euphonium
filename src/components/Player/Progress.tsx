import { currentTime$, currentTrack$ } from '../../modules/player';
import { getFormattedTime } from '../../shared/utils';
import { ProgressBar } from './ProgressBar';

export const Progress = ({ bg, css }: { bg?: string; css?: string }) => (
  <div class={['flex items-center gap-4', css]}>
    {() => getFormattedTime(currentTime$())}
    <ProgressBar bg={bg} />
    {() => currentTrack$()?.durationFormatted || '00:00'}
  </div>
);
