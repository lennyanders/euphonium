import { useComputed } from 'voby';
import { HeroImage } from '../components/HeroImage';
import { TrackList } from '../components/TrackList';
import { params$, RouterLink } from '../router';
import { state } from '../modules/library';

export const Album = () => {
  const { artist, albumTitle } = params$();
  if (!artist || !albumTitle) return 'Something went wrong';

  const album$ = useComputed(() => {
    return state.albums?.find((a) => a.artist === artist && a.title === albumTitle);
  });

  const album = album$();
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
      <HeroImage
        image={album.cover}
        title={album.title}
        sublines={[
          <RouterLink href={`/artist/${encodeURIComponent(album.artist)}`}>
            {album.artist}
          </RouterLink>,
          <>
            {album.year && (
              <>
                {album.year} <div class='i-mdi-candle m-l-.5 m-r-2' />
              </>
            )}
            {album.tracks.length} <div class='i-mdi-music-note m-l-.5 m-r-2' />
            {album.diskCount} <div class='i-mdi-disk m-l-.5 m-r-2' />
            {album.durationFormatted} <div class='i-mdi-timer-sand m-l-.5' />
          </>,
        ]}
      />
      <TrackList tracks={album.tracks} showNumber showDiskNumber />
    </>
  );
};
