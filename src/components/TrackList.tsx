import { play } from '../stores/player';
import { CoverImage } from './CoverImage';

const Track = ({ track, displayNumber }: { track: FETrack; displayNumber?: boolean }) => (
  <li class='flex gap-2 items-center' onClick={() => play(track)}>
    {displayNumber && <span class='w-2ch text-center shrink-0'>{track.number || '-'}</span>}
    <CoverImage src={track.cover} class='w-12 h-12 rd-1 shrink-0' />
    <div class='break-all'>
      {track.title}
      <small class='block'>{track.artist}</small>
    </div>
    <span class='m-l-a'>{track.durationFormatted}</span>
  </li>
);

export const TrackList = ({
  tracks,
  displayNumber,
  displayDiskNumber,
}: {
  tracks: FETrack[];
  displayNumber?: boolean;
  displayDiskNumber?: boolean;
}) => {
  let prevDiskNumber = 0;
  return (
    <ul class='grid gap-2'>
      {tracks.map((track) => {
        if (displayDiskNumber && track.diskNumber && prevDiskNumber !== track.diskNumber) {
          prevDiskNumber = track.diskNumber;
          return (
            <>
              <li>Disk: {track.diskNumber}</li>
              <Track track={track} displayNumber={displayNumber} />
            </>
          );
        }
        return <Track track={track} displayNumber={displayNumber} />;
      })}
    </ul>
  );
};
