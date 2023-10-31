import $ from 'oby';

import { albumDataGetter, artistDataGetter } from './computedValues';
import { postMessageGlobal } from './utils';

export const state = $.store<State>({
  loading: false,
  libraryDirectories: [],
  trackData: {},
  get albumData() {
    return albumDataGetter.apply(this);
  },
  get artistData() {
    return artistDataGetter.apply(this);
  },
});

export const enablePartialUpdates = () => {
  $.store.on(
    () => state.libraryDirectories,
    () => {
      postMessageGlobal({
        message: 'setLibraryDirectories',
        state: $.store.unwrap(state).libraryDirectories,
      });
    },
  );

  $.store.on(
    () => state.trackData,
    () => postMessageGlobal({ message: 'setTrackData', state: $.store.unwrap(state).trackData }),
  );

  $.store.on(
    () => state.albumData,
    () => postMessageGlobal({ message: 'setAlbumData', state: $.store.unwrap(state).albumData }),
  );

  $.store.on(
    () => state.artistData,
    () => postMessageGlobal({ message: 'setArtistData', state: $.store.unwrap(state).artistData }),
  );

  const temporaryDataKeys: (keyof TemporaryData)[] = ['playing', 'importing'];
  for (const key of temporaryDataKeys) {
    $.store.on(
      () => state[key],
      () => {
        postMessageGlobal({
          message: 'setTemporaryData',
          state: { [key]: $.store.unwrap(state)[key] },
        });
      },
    );
  }

  const generalDataKeys: (keyof GeneralData)[] = [
    'queue',
    'originalQueue',
    'activeTrackId',
    'currentTime',
    'volume',
    'mute',
    'shuffle',
    'loop',
  ];
  for (const key of generalDataKeys) {
    $.store.on(
      () => state[key],
      () => {
        postMessageGlobal({
          message: 'setGeneralData',
          state: { [key]: $.store.unwrap(state)[key] },
        });
      },
    );
  }
};
