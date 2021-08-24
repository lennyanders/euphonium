import { postMessage } from './utils';
import { getDatabase } from './database';
import {
  getFileHandlesFromRootDirectories,
  diffFiles,
  updateTrackPaths,
  getDirectoryRelation,
  Relation,
  DirectoryRelationType,
} from './track';

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
  await updateFiles();
  await sendDirectories();
};

export const tryAddDirectory = async (handle: FileSystemDirectoryHandle) => {
  const relation = await getDirectoryRelation(handle);
  if (relation.type === DirectoryRelationType.DirectoryIsNew) {
    const database = await getDatabase();
    await database.add('libraryDirectory', { handle });
    await updateFiles();
    await sendDirectories();
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
  await updateFiles();
  await sendDirectories();
};

const updateFiles = async () => {
  console.time('get files from directories');
  const fileHandles = await getFileHandlesFromRootDirectories();
  console.timeEnd('get files from directories');

  console.time('get difference to existing files');
  const { newFiles, removedTrackIds } = await diffFiles(fileHandles);
  console.timeEnd('get difference to existing files');

  console.time('update database');
  const database = await getDatabase();
  const tx = database.transaction('track', 'readwrite');
  await Promise.all([
    ...removedTrackIds.map((id) => tx.store.delete(id)),
    ...newFiles.map(async (f) => {
      await tx.store.add(f);
    }),
    tx.done,
  ]);
  console.timeEnd('update database');

  console.log({ newFiles, removedTrackIds });
};
