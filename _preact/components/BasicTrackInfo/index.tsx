import { Track } from '../../worker/database';
import { basicTrackInfoClass, coverClass, artistClass } from './index.css';

export const BasicTrackInfo = ({ track }: { track: Track }) => {
  return (
    <div class={basicTrackInfoClass}>
      <div class={coverClass}></div>
      <span>{track.title || track.fileName}</span>
      <small class={artistClass}>{track.artist || 'Unknown artist'}</small>
    </div>
  );
};
