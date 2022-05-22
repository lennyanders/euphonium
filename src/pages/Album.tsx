import { If, useComputed } from 'voby';
import { TracksList } from '../components/TracksList';
import { params, RouterLink } from '../router';
import { getFormattedTime } from '../shared/utils';
import { library } from '../stores/library';

export const Album = () => {
  const { artist, year, albumTitle } = params();
  if (!artist || !albumTitle) return 'Something went wrong';

  const albumData = useComputed(() => {
    const tracks = library()
      .tracks.filter(
        (t) =>
          t.albumArtist === artist &&
          t.albumTitle === albumTitle &&
          (year ? t.year == +year : !t.year),
      )
      .sort((a, b) => (a.number || 0) - (b.number || 0))
      .sort((a, b) => (a.diskNumber || 0) - (b.diskNumber || 0));

    let duration = 0;
    let prevDiskNumber = 0;
    for (const track of tracks) {
      duration += track.duration;

      if (track.diskNumber && track.diskNumber !== prevDiskNumber) {
        track.displayDiskNumber = true;
        prevDiskNumber = track.diskNumber;
      }
    }

    return {
      tracks,
      duration: getFormattedTime(duration),
      disks: tracks.slice(-1)[0]?.diskNumber || 1,
    };
  });

  const { tracks, disks, duration } = albumData();

  return (
    <>
      <h1>{albumTitle}</h1>
      <RouterLink class='m-t--2' href={`/artist/${artist}`}>
        {artist}
      </RouterLink>
      <If
        when={tracks.length}
        fallback={
          <p>
            You don't have that album in you'r library, add directories in the{' '}
            <RouterLink href='/settings' class='underline'>
              settings
            </RouterLink>{' '}
            and start listening to music!
          </p>
        }
      >
        <div class='flex flex-wrap gap-2 m-t--2 m-b-2'>
          <If when={year}>
            <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{year}</span>
          </If>
          <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{tracks.length}</span>
          <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{disks}</span>
          <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{duration}</span>
        </div>
        <TracksList tracks={tracks} displayNumber />
      </If>
    </>
  );
};
