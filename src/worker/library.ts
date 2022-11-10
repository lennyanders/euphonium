import $ from 'oby';

import { DirectoryRelationType, Relation } from '../shared/workerFeCommunicationTypes';
import { getDatabase } from './database';
import {
  getFileHandlesFromRootDirectories,
  diffFiles,
  updateTrackPaths,
  getDirectoryRelation,
  getTrack,
} from './files';
import { beToFETrack } from './files/converters';
import { getCover } from './files/getCover';
import { partialUpdates$, state } from './state';
import { postMessage } from './utils';

const getDbData = async () => {
  const database = await getDatabase();
  const { store } = database.transaction('data');
  const data: GeneralData = {};
  for await (const { key, value } of store.iterate()) data[key] = value as any;
  return data;
};

export const getFETrackData = async () => {
  const database = await getDatabase();
  const covers = await database.getAll('cover');
  const tracks = await database.getAll('track');
  const fetracks: Record<number, FETrack> = {};
  for (const track of tracks) fetracks[track.id!] = beToFETrack(track, covers);
  return fetracks;
};

export const getFEDirectories = async () => {
  const database = await getDatabase();
  const directoryHandles = await database.getAll('libraryDirectory');
  return directoryHandles.map<FELibraryDirectory>(({ handle, id }) => ({
    name: handle.name,
    id: id!,
    directoryHandle: handle,
  }));
};

export const removeDirectory = async (id: number) => {
  const database = await getDatabase();
  await database.delete('libraryDirectory', id);
  state.libraryDirectories = await getFEDirectories();
  await updateFiles();
};

export const tryAddDirectory = async (handle: FileSystemDirectoryHandle) => {
  const relation = await getDirectoryRelation(handle);
  if (relation.type === DirectoryRelationType.DirectoryIsNew) {
    const database = await getDatabase();
    await database.add('libraryDirectory', { handle });
    state.libraryDirectories = await getFEDirectories();
    await updateFiles();
  }
  postMessage({ message: 'tryAddDirectoryToLibrary', relation });
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
  state.libraryDirectories = await getFEDirectories();
  await updateFiles();
};

export const updateFiles = async () => {
  console.time('update');

  console.time('get files from directories');
  const fileHandles = await getFileHandlesFromRootDirectories();
  console.timeEnd('get files from directories');

  console.time('get difference to existing files');
  const database = await getDatabase();

  const existingTracks = await database.getAll('track');
  const [newTracks, removedTrackIds] = diffFiles(existingTracks, fileHandles.tracks);

  const existingCovers = await database.getAll('cover');
  const [newCovers, removedCoverIds] = diffFiles(existingCovers, fileHandles.covers);

  console.timeEnd('get difference to existing files');
  console.log({ newTracks, removedTrackIds, newCover: newCovers, removedCoverIds });

  console.time('parse files');
  const tracks: DbTrack[] = [];
  const covers: DbCover[] = [];
  let count = 0;
  const totalCount = newTracks.length + newCovers.length;
  for (const fileHandle of newTracks) {
    const track = await getTrack(fileHandle);
    if (track) tracks.push(track);

    console.log(`parsed file ${++count} of ${totalCount}`);
  }
  for (const fileHandle of newCovers) {
    const cover = await getCover(fileHandle);
    if (cover) covers.push(cover);

    console.log(`parsed file ${++count} of ${totalCount}`);
  }
  console.timeEnd('parse files');

  console.time('update database');
  const txT = database.transaction('track', 'readwrite');
  const txC = database.transaction('cover', 'readwrite');
  await Promise.all([
    ...removedTrackIds.map((id) => txT.store.delete(id)),
    ...tracks.map((t) => txT.store.add(t)),
    txT.done,
    ...removedCoverIds.map((id) => txC.store.delete(id)),
    ...covers.map((c) => txC.store.add(c)),
    txC.done,
  ]);
  console.timeEnd('update database');

  state.trackData = await getFETrackData();

  console.timeEnd('update');
};

export const setGeneralData = async (data: GeneralData) => {
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

Promise.all([getFEDirectories(), getFETrackData(), getDbData()]).then(
  ([libraryDirectories, trackData, data]) => {
    $.batch(() => Object.assign(state, { libraryDirectories, trackData }, data));

    postMessage({ message: 'setState', state: $.store.unwrap(state) });
    partialUpdates$(true);
  },
);
