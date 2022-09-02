import { $, If, useMemo, Observable, useEffect } from 'voby';
import { AlbumList } from '../components/AlbumList';
import { ArtistList } from '../components/ArtistList';
import { Input } from '../components/Form/Inputs';
import { TrackList } from '../components/TrackList';
import {
  albumsSortedByTitle$,
  artistsSortedByName$,
  tracksSortedByTitle$,
} from '../modules/library';
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
  const lowerQuery$ = useMemo(() => query$().toLowerCase());

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
          trackIds={useMemo(() =>
            tracksSortedByTitle$()
              .filter(
                (track) =>
                  track.title.toLowerCase().includes(lowerQuery$()) ||
                  track.artist?.toLowerCase().includes(lowerQuery$()),
              )
              .map((track) => track.id),
          )}
        />
      </If>
      <If when={queryAlbums$}>
        <h2>Albums</h2>
        <AlbumList
          albumIds={useMemo(() =>
            albumsSortedByTitle$()
              .filter(
                (album) =>
                  album.title.toLowerCase().includes(lowerQuery$()) ||
                  album.artist.toLowerCase().includes(lowerQuery$()) ||
                  album.year?.toString() === lowerQuery$(),
              )
              .map((album) => `${album.artist}${album.title}`),
          )}
        />
      </If>
      <If when={queryArtists$}>
        <h2>Artists</h2>
        <ArtistList
          artistIds={useMemo(() =>
            artistsSortedByName$()
              .filter((artist) => artist.name.toLowerCase().includes(lowerQuery$()))
              .map((artist) => artist.name),
          )}
        />
      </If>
    </>
  );
};
