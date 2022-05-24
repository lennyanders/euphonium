import { $, useComputed } from 'voby';
import { TracksList } from '../components/TracksList';
import { params, RouterLink } from '../router';
import { library } from '../stores/library';

const AlbumInfo =
  ({ album }: { album: FEAlbum }) =>
  () => {
    const desktopMatcher = matchMedia('(min-width: 640px)');
    const desktop = $(desktopMatcher.matches);
    desktopMatcher.addEventListener('change', ({ matches }) => desktop(matches));

    if (desktop())
      return (
        <div class='flex gap-4'>
          {album.cover ? (
            <img class='w-25% rd-2' src={album.cover} />
          ) : (
            <div class='w-25% color-[#111] i-mdi-disk'></div>
          )}
          <div class='flex flex-col justify-end items-start p-b-4 overflow-hidden'>
            <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate relative'>{album.title}</span>
            <small class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate relative m-t-1'>
              <RouterLink href={`/artist/${album.artist}`}>{album.artist}</RouterLink>
            </small>
            <small class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate relative m-t-1'>
              {[album.year, album.tracks?.length, album.diskCount, album.durationFormatted]
                .filter((v) => v)
                .join(' | ')}
            </small>
          </div>
        </div>
      );

    const fullImage = $(false);
    return (
      <div
        class={() =>
          `${
            fullImage() ? '' : 'm-t-[calc(-30vw-3rem)]'
          } p-t-8 relative m--4 min-w-[calc(100%+2rem)] overflow-hidden transition-margin duration-250 m-b-2`
        }
        onClick={() => fullImage((val) => !val)}
      >
        {album.cover ? (
          <img
            class={() =>
              `w-100% transition-transform duration-250 ${
                fullImage() ? 'translate-y--8' : 'translate-y-15vw'
              }`
            }
            src={album.cover}
          />
        ) : (
          <div class='w-100% h-100% color-[#111] i-mdi-disk'></div>
        )}
        <div
          class={() =>
            `${
              fullImage() ? 'opacity-0' : ''
            } transition-opacity duration-250 absolute left-3 right-3 bottom-3 flex flex-col items-start gap-1`
          }
        >
          <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate'>{album.title}</span>
          <small class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate'>
            <RouterLink href={`/artist/${album.artist}`}>{album.artist}</RouterLink>
          </small>
          <small class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate'>
            {[album.year, album.tracks?.length, album.diskCount, album.durationFormatted]
              .filter((v) => v)
              .join(' | ')}
          </small>
        </div>
        <div
          class={() =>
            `i-mdi-chevron-up absolute bottom--3 w-12 h-12 left-50% m-l--6 transition-opacity duration-250 ${
              fullImage() ? '' : 'opacity-0'
            }`
          }
        />
      </div>
    );
  };

export const Album = () => {
  const { artist, year, albumTitle } = params();
  if (!artist || !albumTitle) return 'Something went wrong';

  const albumData = useComputed(() => {
    const { albums, tracks } = library();
    const album = albums.find(
      (a) => a.artist === artist && a.title === albumTitle && (year ? a.year === +year : !a.year),
    );
    if (!album) return {};
    return {
      album,
      tracks: album?.tracks.map((id) => tracks.find((track) => track.id === id)!),
    };
  });

  const { album, tracks } = albumData();
  if (!album) {
    return (
      <p>
        You don't have that album in you'r library, add directories in the{' '}
        <RouterLink href='/settings' class='underline'>
          settings
        </RouterLink>{' '}
        and start listening to music!
      </p>
    );
  }

  return (
    <>
      <AlbumInfo album={album} />
      <TracksList tracks={tracks} displayNumber displayDiskNumber />
    </>
  );
};
