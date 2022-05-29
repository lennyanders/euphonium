import { currentTrackId$, play } from '../modules/player';
import { CoverImage } from './CoverImage';

const Track = ({
  tracks,
  track,
  displayNumber,
}: {
  tracks: FETrack[];
  track: FETrack;
  displayNumber?: boolean;
}) => (
  <li
    class={() => [
      'flex gap-2 items-center p-1 rd-1',
      currentTrackId$() === track.id && 'bg-[#333]',
    ]}
    onClick={() => play(track, tracks)}
  >
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
    <ul class='grid m--1'>
      {tracks.map((track) => {
        if (displayDiskNumber && track.diskNumber && prevDiskNumber !== track.diskNumber) {
          prevDiskNumber = track.diskNumber;
          return (
            <>
              <li>Disk: {track.diskNumber}</li>
              <Track track={track} displayNumber={displayNumber} tracks={tracks} />
            </>
          );
        }
        return <Track track={track} displayNumber={displayNumber} tracks={tracks} />;
      })}
    </ul>
  );
};
