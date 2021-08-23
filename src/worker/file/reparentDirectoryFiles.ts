import { getDatabase } from '../database';

export const reparentDirectoryFiles = async (
  newKey: number,
  oldKey: number,
  pathDifference: string[],
) => {
  const newPathStart = pathDifference.join('/');
  const database = await getDatabase();
  const tx = database.transaction('fileHandle', 'readwrite');

  const fileHandles = await tx.store.index('rootDirectory').getAll(oldKey);
  await Promise.all(
    fileHandles.map((fileHandle) => {
      fileHandle.path = `${newPathStart}/${fileHandle.path}`;
      fileHandle.rootDirectory = newKey;
      tx.store.put(fileHandle);
    }),
  );
  await tx.done;
};
