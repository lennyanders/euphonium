import { FileHandle } from './FileHandle';

export const diffFiles = (
  existingFiles: (DbTrack | DbCover)[],
  currentFiles: FileHandle[],
): [FileHandle[], number[]] => {
  const newFiles = currentFiles.filter(
    (file) => !existingFiles.find((f) => f.filePath === file.filePath),
  );

  const removedFileIds = existingFiles
    .filter((file) => !existingFiles.find((f) => f.filePath === file.filePath))
    .map((file) => file.id!);

  return [newFiles, removedFileIds];
};
