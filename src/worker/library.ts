import { postMessage } from './utils';
import { getDatabase } from './database';
import {
  getFileHandlesFromRootDirectories,
  diffFiles,
  updateTrackPaths,
  getDirectoryRelation,
  getTrack,
} from './files';
import { fileHandleIsCover } from './files/utils';
import { getCover } from './files/getCover';
import { beToFETrack } from './files/coverters';
import { libraryDirectories$, tracks$ } from './store';
import { DirectoryRelationType, Relation } from '../shared/workerFeCommunicationTypes';

export const getFETracks = async () => {
  const database = await getDatabase();
  const covers = await database.getAll('cover');
  const tracks = await database.getAll('track');
  return tracks.map((track) => beToFETrack(track, covers));
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
  libraryDirectories$(await getFEDirectories());
  await updateFiles();
};

export const tryAddDirectory = async (handle: FileSystemDirectoryHandle) => {
  const relation = await getDirectoryRelation(handle);
  if (relation.type === DirectoryRelationType.DirectoryIsNew) {
    const database = await getDatabase();
    await database.add('libraryDirectory', { handle });
    libraryDirectories$(await getFEDirectories());
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
  libraryDirectories$(await getFEDirectories());
  await updateFiles();
};

export const updateFiles = async () => {
  console.time('update');
  console.time('get files from directories');
  const fileHandles = await getFileHandlesFromRootDirectories();
  console.timeEnd('get files from directories');

  console.time('get difference to existing files');
  const { newFiles, removedTrackIds, removedCoverIds } = await diffFiles(fileHandles);
  console.timeEnd('get difference to existing files');

  console.time('parse files');
  const tracks: DbTrack[] = [];
  const covers: DbCover[] = [];
  let count = 0;
  for (const fileHandle of newFiles) {
    if (fileHandleIsCover(fileHandle)) {
      const cover = await getCover(fileHandle);
      if (cover) covers.push(cover);
    } else {
      const track = await getTrack(fileHandle);
      if (track) tracks.push(track);
    }
    console.log(`parsed file ${++count} of ${newFiles.length}`);
  }
  console.timeEnd('parse files');

  console.time('update database');
  const database = await getDatabase();
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

  tracks$(await getFETracks());
  console.timeEnd('update');
};

getFEDirectories().then(libraryDirectories$);
getFETracks().then(tracks$);
