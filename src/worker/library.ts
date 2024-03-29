import $ from 'oby';

import { wait } from '../shared/utils';
import { DirectoryRelationType, Relation } from '../shared/workerCommunicationTypes';
import { getDatabase } from './database';
import {
  getFileHandlesFromRootDirectories,
  diffFiles,
  updateTrackPaths,
  getDirectoryRelation,
  getTrack,
} from './files';
import { beToFeTrack } from './files/converters';
import { getCover } from './files/getCover';
import { enablePartialUpdates, state } from './state';
import { onConnect, postMessage, postMessageGlobal } from './utils';

const getDbData = async () => {
  const database = await getDatabase();
  const { store } = database.transaction('data');
  const data: GeneralData = {};
  for await (const { key, value } of store.iterate()) data[key] = value as any;
  return data;
};

export const getFeTrackData = async () => {
  const database = await getDatabase();
  const covers = await database.getAll('cover');
  const tracks = await database.getAll('track');
  const fetracks: Record<number, FeTrack> = {};
  for (const track of tracks) fetracks[track.id!] = beToFeTrack(track, covers);
  return fetracks;
};

export const getFeDirectories = async () => {
  const database = await getDatabase();
  const directoryHandles = await database.getAll('libraryDirectory');
  return directoryHandles.map<FeLibraryDirectory>(({ handle, id }) => ({
    name: handle.name,
    id: id!,
    directoryHandle: handle,
  }));
};

export const removeDirectory = async (id: number) => {
  const database = await getDatabase();
  await database.delete('libraryDirectory', id);
  state.libraryDirectories = await getFeDirectories();
  await updateFiles();
};

export const tryAddDirectory = async (handle: FileSystemDirectoryHandle) => {
  const relation = await getDirectoryRelation(handle);
  if (relation.type === DirectoryRelationType.DirectoryIsNew) {
    const database = await getDatabase();
    await database.add('libraryDirectory', { handle });
    state.libraryDirectories = await getFeDirectories();
    await updateFiles();
  }
  postMessageGlobal({ message: 'tryAddDirectoryToLibrary', relation });
};

export const forceAddDirectory = async (relation: Relation, handle: FileSystemDirectoryHandle) => {
  if (relation.type !== DirectoryRelationType.DirectoryIsParentOfImportetDirectories) return;

  const database = await getDatabase();
  const id = await database.add('libraryDirectory', { handle });

  console.time('reparent directories');
  for (const { id: oldId, pathDifference } of relation.parentOfDirectories) {
    await updateTrackPaths(id, oldId, pathDifference);
    await database.delete('libraryDirectory', oldId);
  }
  console.timeEnd('reparent directories');
  state.libraryDirectories = await getFeDirectories();
  await updateFiles();
};

export const updateFiles = async () => {
  console.time('update');

  const now = performance.now();

  state.importing = true;

  console.time('get files from directories');
  const fileHandles = await getFileHandlesFromRootDirectories();
  console.timeEnd('get files from directories');

  console.time('get difference to existing files');
  const database = await getDatabase();

  const existingTracks = await database.getAll('track');
  const [newTracks, changedTracks, removedTrackIds] = await diffFiles(
    existingTracks,
    fileHandles.tracks,
  );

  const existingCovers = await database.getAll('cover');
  const [newCovers, changedCovers, removedCoverIds] = await diffFiles(
    existingCovers,
    fileHandles.covers,
  );
  console.timeEnd('get difference to existing files');

  console.time('parse files');
  const newDbTracks: DbTrack[] = [];
  const changedDbTracks: DbTrack[] = [];
  const newDbCovers: DbCover[] = [];
  const changedDbCovers: DbCover[] = [];
  let count = 0;
  const totalCount =
    newTracks.length + changedTracks.length + newCovers.length + changedCovers.length;
  for (const fileHandle of newTracks) {
    const track = await getTrack(fileHandle);
    if (track) newDbTracks.push(track);

    console.log(`parsed file ${++count} of ${totalCount}`);
  }
  for (const fileHandle of changedTracks) {
    const track = await getTrack(fileHandle);
    if (track) changedDbTracks.push(track);

    console.log(`parsed file ${++count} of ${totalCount}`);
  }
  for (const fileHandle of newCovers) {
    const cover = await getCover(fileHandle);
    if (cover) newDbCovers.push(cover);

    console.log(`parsed file ${++count} of ${totalCount}`);
  }
  for (const fileHandle of changedCovers) {
    const cover = await getCover(fileHandle);
    if (cover) changedDbCovers.push(cover);

    console.log(`parsed file ${++count} of ${totalCount}`);
  }
  console.timeEnd('parse files');

  console.time('update database');
  const txT = database.transaction('track', 'readwrite');
  const txC = database.transaction('cover', 'readwrite');
  await Promise.all([
    ...removedTrackIds.map((id) => txT.store.delete(id)),
    ...newDbTracks.map((track) => txT.store.add(track)),
    ...changedDbTracks.map((track) => txT.store.put(track)),
    ...removedCoverIds.map((id) => txC.store.delete(id)),
    ...newDbCovers.map((cover) => txC.store.add(cover)),
    ...changedDbCovers.map((cover) => txC.store.put(cover)),
  ]);
  await Promise.all([txT.done, txC.done]);
  console.timeEnd('update database');

  state.trackData = await getFeTrackData();

  console.timeEnd('update');

  const minTime = 1000;
  const timeSpent = performance.now() - now;
  if (timeSpent < minTime) await wait(minTime - timeSpent);
  delete state.importing;
};

let autoPauseTimeout: NodeJS.Timeout;
export const setGeneralData = async (data: GeneralData) => {
  if (data.currentTime) {
    clearTimeout(autoPauseTimeout);
    // 300ms cause timeupdate can take up to 250ms and a bit of buffer https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
    autoPauseTimeout = setTimeout(() => (state.playing = false), 300);
  }

  Object.assign(state, data);

  const database = await getDatabase();
  const tx = database.transaction('data', 'readwrite');
  const txs: Promise<any>[] = [];
  for (const _key in data) {
    const key = _key as keyof GeneralData;
    if (data[key] === undefined) txs.push(tx.store.delete(key));
    else txs.push(tx.store.put(data[key], key));
  }
  await Promise.all([...txs, tx.done]);
};

export const setTemporaryData = (data: TemporaryData) => {
  if (data.playing === false) clearTimeout(autoPauseTimeout);

  Object.assign(state, data);
};

Promise.all([getFeDirectories(), getFeTrackData(), getDbData()]).then(
  ([libraryDirectories, trackData, data]) => {
    Object.assign(state, { libraryDirectories, trackData }, data);

    postMessageGlobal({ message: 'setState', state: $.store.unwrap(state) });
    onConnect((port) => postMessage(port, { message: 'setState', state: $.store.unwrap(state) }));

    enablePartialUpdates();
  },
);
