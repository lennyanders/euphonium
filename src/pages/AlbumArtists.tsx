import { $$, Ternary, useMemo } from 'voby';

import { ArtistList } from '../components/ArtistList';
import { artistsSortedByName$ } from '../modules/library';

export const AlbumArtists = () => {
  const albumArtists$ = useMemo(() =>
    $$(artistsSortedByName$)
      .filter((artist) => artist.albums.length)
      .map((artist) => artist.name),
  );
  return (
    <Ternary when={() => $$(albumArtists$)?.length}>
      <>
        <h1>Album Artists</h1>
        <ArtistList artistIds={albumArtists$} />
      </>
      {/* no album artists */}
      <p>
        Add directories in the
        <a href='/settings' class='underline'>
          settings
        </a>
        and start listening to music!
      </p>
    </Ternary>
  );
};
