import { Ternary, useMemo } from 'voby';
import { ArtistList } from '../components/ArtistList';
import { RouterLink } from '../router';
import { state } from '../modules/library';

export const AlbumArtists = () => {
  const albumArtists$ = useMemo(() =>
    Object.values(state.artistData)
      .filter((artist) => artist.albums.length)
      .sort((a, b) => (b.name && a.name?.localeCompare(b.name)) || 0)
      .map((artist) => artist.name),
  );
  return (
    <Ternary when={() => albumArtists$()?.length}>
      <>
        <h1>Album Artists</h1>
        <ArtistList artistIds={albumArtists$} />
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
