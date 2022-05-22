import { getDatabase } from '../database';
import { FileHandle } from './FileHandle';
import { fileHandleIsCover } from './utils';

export const diffFiles = async (files: FileHandle[]) => {
  const database = await getDatabase();
  const existingTracks = await database.getAll('track');
  const existingCovers = await database.getAll('cover');

  const newFiles = files.filter(
    (file) => !existingTracks.find((f) => f.filePath === file.filePath),
  );
  const removedFiles = [...existingTracks, ...existingCovers]
    .filter((file) => !files.find((f) => f.filePath === file.filePath))
    .reduce<{ removedTrackIds: number[]; removedCoverIds: number[] }>(
      (res, file) => {
        if (fileHandleIsCover(file)) res.removedCoverIds.push(file.id!);
        else res.removedTrackIds.push(file.id!);
        return res;
      },
      { removedTrackIds: [], removedCoverIds: [] },
    );

  return { newFiles, ...removedFiles };
};
