import { useComputed } from 'voby';
import { TracksList } from '../components/TracksList';
import { params, RouterLink } from '../router';
import { library } from '../stores/library';

export const Album = () => {
  const { artist, year, albumTitle } = params();
  if (!artist || !albumTitle) return 'Something went wrong';

  const albumData = useComputed(() => {
    const { albums, tracks } = library();
    const album = albums.find(
      (a) => a.artist === artist && a.title === albumTitle && (year ? a.year === +year : !a.year),
    );
    return {
      ...album,
      tracks: album?.tracks.map((id) => tracks.find((track) => track.id === id)!),
    };
  });

  const { tracks, diskCount, durationFormatted } = albumData();

  return (
    <>
      <h1>{albumTitle}</h1>
      <RouterLink class='m-t--2' href={`/artist/${artist}`}>
        {artist}
      </RouterLink>
      {!tracks?.length ? (
        <p>
          You don't have that album in you'r library, add directories in the{' '}
          <RouterLink href='/settings' class='underline'>
            settings
          </RouterLink>{' '}
          and start listening to music!
        </p>
      ) : (
        <>
          <div class='flex flex-wrap gap-2 m-t--2 m-b-2'>
            {year && <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{year}</span>}
            <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{tracks?.length}</span>
            <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{diskCount}</span>
            <span class='p-x-2 min-w-6 rd-4 bg-[#111] text-center'>{durationFormatted}</span>
          </div>
          <TracksList tracks={tracks} displayNumber displayDiskNumber />
        </>
      )}
    </>
  );
};
