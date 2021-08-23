import { EuphoniumFileHandle } from '../database';
import { getDatabase } from '../database';

export const diffFiles = async (fileHandles: EuphoniumFileHandle[]) => {
  const database = await getDatabase();
  const existingFileHandles = await database.getAll('fileHandle');

  const newFiles = fileHandles.filter(
    (file) => !existingFileHandles.find((f) => f.path === file.path),
  );
  const removedFilesIds = existingFileHandles
    .filter((file) => !fileHandles.find((f) => f.path === file.path))
    .map((f) => f.id!);

  return { newFiles, removedFilesIds };
};
