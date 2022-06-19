import { Ternary, useComputed } from 'voby';
import { ArtistList } from '../components/ArtistList';
import { RouterLink } from '../router';
import { state } from '../modules/library';

export const AlbumArtists = () => {
  const albumArtists$ = useComputed(() => state.artists?.filter((artist) => artist.albums.length)!);
  return (
    <Ternary when={() => albumArtists$()?.length}>
      <>
        <h1>Album Artists</h1>
        <ArtistList artists={albumArtists$} />
      </>
      {/* no album artists */}
      <p>
        Add directories in the
        <RouterLink href='/settings' class='underline'>
          settings
        </RouterLink>
        and start listening to music!
      </p>
    </Ternary>
  );
};
