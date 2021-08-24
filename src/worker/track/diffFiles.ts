import { getDatabase } from '../database';
import { FileHandle } from './FileHandle';

export const diffFiles = async (tracks: FileHandle[]) => {
  const database = await getDatabase();
  const existingTracks = await database.getAll('track');

  const newFiles = tracks.filter(
    (file) => !existingTracks.find((f) => f.filePath === file.filePath),
  );
  const removedTrackIds = existingTracks
    .filter((file) => !tracks.find((f) => f.filePath === file.filePath))
    .map((f) => f.id!);

  return { newFiles, removedTrackIds };
};
