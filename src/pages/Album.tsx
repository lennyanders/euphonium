import { useComputed } from 'voby';
import { HeroImage } from '../components/HeroImage';
import { TrackList } from '../components/TrackList';
import { params, RouterLink } from '../router';
import { library } from '../stores/library';

export const Album = () => {
  const { artist, albumTitle } = params();
  if (!artist || !albumTitle) return 'Something went wrong';

  const albumData = useComputed(() => {
    return library().albums.find((a) => a.artist === artist && a.title === albumTitle);
  });

  const album = albumData();
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
          [album.year, album.tracks?.length, album.diskCount, album.durationFormatted]
            .filter((v) => v)
            .join(' | '),
        ]}
      />
      <TrackList tracks={album.tracks} displayNumber displayDiskNumber />
    </>
  );
};
