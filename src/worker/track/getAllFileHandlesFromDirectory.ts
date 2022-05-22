import { getDatabase } from '../database';
import { postMessage } from '../utils';
import { FileHandle } from './FileHandle';

export const getFileHandlesFromRootDirectories = async (): Promise<FileHandle[]> => {
  const database = await getDatabase();
  const rootDirectoryHandles = await database.getAll('libraryDirectory');
  return (
    await Promise.all(
      rootDirectoryHandles.map(({ handle, id }) => {
        return getAllFileHandlesFromDirectory({
          directoryHandle: handle,
          libraryDirectory: id!,
        });
      }),
    )
  ).flat();
};

const getAllFileHandlesFromDirectory = async ({
  directoryHandle,
  libraryDirectory,
  path = libraryDirectory.toString(),
}: {
  directoryHandle: FileSystemDirectoryHandle;
  path?: string;
  libraryDirectory: number;
}) => {
  const fileSystemHandles: FileHandle[] = [];
  try {
    for await (const fileSystemHandle of directoryHandle.values()) {
      const handlePath = `${path ? `${path}/` : ''}${fileSystemHandle.name}`;
      if (fileSystemHandle.kind === 'directory') {
        fileSystemHandles.push(
          ...(await getAllFileHandlesFromDirectory({
            directoryHandle: fileSystemHandle,
            path: handlePath,
            libraryDirectory,
          })),
        );
      } else if (/\.aac$|\.mp3$|\.ogg$|\.wav$|\.flac$|\.m4a$/.test(fileSystemHandle.name)) {
        fileSystemHandles.push({
          filePath: handlePath,
          fileName: fileSystemHandle.name.split('.')[0],
          libraryDirectory,
          directoryHandle,
          fileHandle: fileSystemHandle,
        });
      }
    }
    return fileSystemHandles;
  } catch (_) {
    postMessage({ message: 'requestPermission', directoryHandle });
    throw Error();
  }
};
