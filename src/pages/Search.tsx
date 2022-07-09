import { $, If, useComputed, Observable, useEffect } from 'voby';
import { AlbumList } from '../components/AlbumList';
import { ArtistList } from '../components/ArtistList';
import { Input } from '../components/Form/Inputs';
import { TrackList } from '../components/TrackList';
import { state } from '../modules/library';
import { queryParams } from '../router';

const Checkbox = ({ label, model }: { label: string; model: Observable<boolean> }) => {
  const id = crypto.randomUUID();
  return (
    <>
      <Input
        id={id}
        type='checkbox'
        model={model}
        class='op-0 absolute pointer-events-none next:not-checked:op-50 next:focus-visible:shadow-[0_0_0_2px_rgb(34,34,34),0_0_0_4px_rgba(195,195,195,0.65)]'
      />
      <label for={id} class='cursor-pointer p-1-3 rd-4 bg-amber-300 c-black transition-opacity'>
        {label}
      </label>
    </>
  );
};

export const Search = () => {
  const query$ = $('');
  useEffect(() => {
    query$(queryParams.search || '');
  });
  useEffect(() => {
    queryParams.search = query$();
  });
  const queryTracks$ = $(true);
  const queryAlbums$ = $(true);
  const queryArtists$ = $(true);
  const lowerQuery$ = useComputed(() => query$().toLowerCase());

  const tracks$ = useComputed(() =>
    Object.values(state.trackData).sort((a, b) => a.title.localeCompare(b.title)),
  );
  const albums$ = useComputed(() =>
    Object.values(state.albumData).sort((a, b) => a.title.localeCompare(b.title)),
  );
  const artists$ = useComputed(() =>
    Object.values(state.artistData).sort((a, b) => (b.name && a.name?.localeCompare(b.name)) || 0),
  );

  return (
    <>
      <h1>Search</h1>
      <div class='relative'>
        <Input
          id='search'
          type='search'
          model={query$}
          placeholder='Search'
          class='w-100% bg-dark-800 p-2-3 rd-2 next:not-placeholder-shown:hidden next:next:placeholder-shown:hidden'
        />
        <label for='search' class='absolute top-2 right-3 i-mdi-search w-6 h-6 cursor-pointer' />
        <button
          class='absolute top-2 right-3 i-mdi-close w-6 h-6 cursor-pointer'
          onClick={() => query$('')}
        />
      </div>
      <div class='flex flex-wrap gap-2 text-sm'>
        <Checkbox label='Tracks' model={queryTracks$} />
        <Checkbox label='Albums' model={queryAlbums$} />
        <Checkbox label='Artists' model={queryArtists$} />
      </div>
      <If when={queryTracks$}>
        <h2>Tracks</h2>
        <TrackList
          trackIds={() =>
            tracks$()
              .filter(
                (track) =>
                  track.title.toLowerCase().includes(lowerQuery$()) ||
                  track.artist?.toLowerCase().includes(lowerQuery$()),
              )
              .map((track) => track.id)
          }
        />
      </If>
      <If when={queryAlbums$}>
        <h2>Albums</h2>
        <AlbumList
          albumIds={() =>
            albums$()
              .filter(
                (album) =>
                  album.title.toLowerCase().includes(lowerQuery$()) ||
                  album.artist.toLowerCase().includes(lowerQuery$()) ||
                  album.year?.toString() === lowerQuery$(),
              )
              .map((album) => `${album.artist}${album.title}`)
          }
        />
      </If>
      <If when={queryArtists$}>
        <h2>Artists</h2>
        <ArtistList
          artistIds={() =>
            artists$()
              .filter((artist) => artist.name.toLowerCase().includes(lowerQuery$()))
              .map((artist) => artist.name)
          }
        />
      </If>
    </>
  );
};
