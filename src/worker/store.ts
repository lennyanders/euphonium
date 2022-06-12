import $ from 'oby';
import { albumsGetter, artistsGetter } from './computedValues';
import { postMessage, uw } from './utils';

export type Store = Partial<
  {
    libraryDirectories: FELibraryDirectory[];
    tracks: FETrack[];
    albums: FEAlbum[];
    artists: FEArtist[];
  } & DbGeneralData
>;

export const store = $.store<Store>({
  get albums() {
    return albumsGetter.apply(this);
  },
  get artists() {
    return artistsGetter.apply(this);
  },
});

$.effect(() => {
  if (!store.libraryDirectories) return;
  postMessage({ message: 'setLibraryDirectories', state: uw(store).libraryDirectories! });
});

$.effect(() => {
  if (store.tracks) postMessage({ message: 'setTracks', state: uw(store).tracks! });
});

$.effect(() => {
  if (store.albums) postMessage({ message: 'setAlbums', state: uw(store).albums! });
});

$.effect(() => {
  if (store.artists) postMessage({ message: 'setArtists', state: uw(store).artists! });
});

$.effect(() => {
  const activeTrackId = store.activeTrackId;
  const queue = store.queue;
  const tracks = uw(store).tracks;
  if (typeof activeTrackId !== 'number' || !queue || !tracks) return;

  postMessage({
    message: 'setGeneralData',
    state: {
      queue: uw(store)
        .queue!.map((id) => tracks.find((track) => track.id === id))
        .filter((track) => track) as FETrack[],
      activeTrackId,
    },
  });
});
