import { EuphoniumFileHandle } from '../database';
import { getDatabase } from '../database';

export const getFileHandlesFromRootDirectories = async (): Promise<EuphoniumFileHandle[]> => {
  const database = await getDatabase();
  const rootDirectoryHandles = await database.getAll('libraryDirectoryHandle');
  return (
    await Promise.all(
      rootDirectoryHandles.map(({ handle, id }) =>
        getAllFileHandlesFromDirectory({
          directoryHandle: handle,
          rootDirectory: id!,
        }),
      ),
    )
  ).flat();
};

const getAllFileHandlesFromDirectory = async ({
  directoryHandle,
  path = '',
  rootDirectory,
}: {
  directoryHandle: FileSystemDirectoryHandle;
  path?: string;
  rootDirectory: number;
}) => {
  const fileSystemHandles: EuphoniumFileHandle[] = [];
  const promises: Promise<EuphoniumFileHandle[]>[] = [];
  for await (const fileSystemHandle of directoryHandle.values()) {
    const _path = `${path ? `${path}/` : ''}${fileSystemHandle.name}`;
    if (fileSystemHandle.kind === 'directory') {
      promises.push(
        getAllFileHandlesFromDirectory({
          directoryHandle: fileSystemHandle,
          path: _path,
          rootDirectory,
        }),
      );
    } else {
      fileSystemHandles.push({
        path: _path,
        rootDirectory,
        directoryHandle,
        fileHandle: fileSystemHandle,
      });
    }
  }
  for (const subdirectoryFileHandles of await Promise.all(promises)) {
    fileSystemHandles.push(...subdirectoryFileHandles);
  }
  return fileSystemHandles;
};
