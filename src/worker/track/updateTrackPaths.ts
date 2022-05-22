import { getDatabase } from '../database';

export const updateTrackPaths = async (
  newKey: number,
  oldKey: number,
  pathDifference: string[],
) => {
  const newPathStart = pathDifference.join('/');
  const database = await getDatabase();
  const tx = database.transaction('track', 'readwrite');

  const tracks = await tx.store.index('libraryDirectory').getAll(oldKey);
  await Promise.all(
    tracks.map((fileHandle) => {
      fileHandle.filePath = `${newPathStart}/${fileHandle.filePath}`;
      fileHandle.folderPath = `${newPathStart}/${fileHandle.folderPath}`;
      fileHandle.libraryDirectory = newKey;
      tx.store.put(fileHandle);
    }),
  );
  await tx.done;
};
