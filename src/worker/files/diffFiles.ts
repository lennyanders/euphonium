export const diffFiles = async <T extends DbTrack | DbCover>(
  existingFiles: T[],
  currentFiles: FileHandle[],
): Promise<[FileHandle[], T[], number[]]> => {
  const stayingFiles = existingFiles.filter((existingFile) => {
    return currentFiles.find((currentFile) => currentFile.filePath === existingFile.filePath);
  });

  const newFiles = currentFiles.filter((currentFile) => {
    return !stayingFiles.find((stayingFile) => stayingFile.filePath === currentFile.filePath);
  });

  const changedFiles = (
    await Promise.all(
      stayingFiles.map(async (stayingFile) => {
        if ((await stayingFile.fileHandle.getFile()).lastModified > stayingFile.fileModified) {
          return stayingFile;
        }
      }),
    )
  ).filter((changedFile) => changedFile) as T[];

  const removedFiles = existingFiles.filter((existingFile) => {
    return !stayingFiles.find((stayingFile) => stayingFile.filePath === existingFile.filePath);
  });

  return [newFiles, changedFiles, removedFiles.map((file) => file.id!)];
};
