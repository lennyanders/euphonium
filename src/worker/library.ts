import { postMessage } from './utils';
import { getDatabase, Track } from './database';
import {
  getFileHandlesFromRootDirectories,
  diffFiles,
  updateTrackPaths,
  getDirectoryRelation,
  Relation,
  DirectoryRelationType,
  getTrack,
} from './track';

export const getTracks = async () => {
  const database = await getDatabase();
  return await database.getAll('track');
};

export const getDirectories = async () => {
  const database = await getDatabase();
  const directoryHandles = await database.getAll('libraryDirectory');
  return directoryHandles.map(({ handle, id }) => ({ name: handle.name, id: id! }));
};

const sendDirectories = async () => {
  postMessage({ message: 'updateState', state: { libraryDirectories: await getDirectories() } });
};

export const removeDirectory = async (id: number) => {
  const database = await getDatabase();
  await database.delete('libraryDirectory', id);
  await sendDirectories();
  await updateFiles();
};

export const tryAddDirectory = async (handle: FileSystemDirectoryHandle) => {
  const relation = await getDirectoryRelation(handle);
  if (relation.type === DirectoryRelationType.DirectoryIsNew) {
    const database = await getDatabase();
    await database.add('libraryDirectory', { handle });
    await sendDirectories();
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
  await sendDirectories();
  await updateFiles();
};

const updateFiles = async () => {
  console.time('get files from directories');
  const fileHandles = await getFileHandlesFromRootDirectories();
  console.timeEnd('get files from directories');

  console.time('get difference to existing files');
  const { newFiles, removedTrackIds } = await diffFiles(fileHandles);
  console.timeEnd('get difference to existing files');

  console.time('get tracks');
  const tracks: Track[] = [];
  let count = 0;
  for (const fileHandle of newFiles) {
    const track = await getTrack(fileHandle);
    if (track) tracks.push(track);
    console.log(`added track ${++count} of ${newFiles.length}`);
  }
  console.timeEnd('get tracks');

  console.time('update database');
  const database = await getDatabase();
  const tx = database.transaction('track', 'readwrite');
  await Promise.all([
    ...removedTrackIds.map((id) => tx.store.delete(id)),
    ...tracks.map((f) => tx.store.add(f) as unknown as void),
    tx.done,
  ]);
  console.timeEnd('update database');

  if (tracks.length) postMessage({ message: 'updateState', state: { tracks: await getTracks() } });
};
