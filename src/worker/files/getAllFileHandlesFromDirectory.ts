import { getDatabase } from '../database';
import { postMessage } from '../utils';
import { FileHandle } from './FileHandle';

const trackMatcher = /\.aac$|\.mp3$|\.ogg$|\.wav$|\.flac$|\.m4a$/;
const coverMatcher = /^cover\.png$|^cover\.jpg$/i;

type LibraryFileHandles = { tracks: FileHandle[]; covers: FileHandle[] };

export const getFileHandlesFromRootDirectories = async () => {
  const database = await getDatabase();
  const rootDirectoryHandles = await database.getAll('libraryDirectory');
  const fileHandlesPerRootDirectory = await Promise.all(
    rootDirectoryHandles.map(({ handle, id }) => {
      return getAllFileHandlesFromDirectory({ directoryHandle: handle, libraryDirectory: id! });
    }),
  );
  return fileHandlesPerRootDirectory.reduce<LibraryFileHandles>(
    (res, cur) => ({
      tracks: res.tracks.concat(cur.tracks),
      covers: res.covers.concat(cur.covers),
    }),
    { tracks: [], covers: [] },
  );
};

const getAllFileHandlesFromDirectory = async ({
  directoryHandle,
  libraryDirectory,
  path = libraryDirectory.toString(),
}: {
  directoryHandle: FileSystemDirectoryHandle;
  libraryDirectory: number;
  path?: string;
}) => {
  const res: LibraryFileHandles = { tracks: [], covers: [] };
  try {
    for await (const fileSystemHandle of directoryHandle.values()) {
      const folderPath = `${path ? `${path}/` : ''}`;
      const handlePath = `${folderPath}${fileSystemHandle.name}`;

      const getFileHandle = (fileHandle: FileSystemFileHandle): FileHandle => ({
        filePath: handlePath,
        folderPath,
        fileName: fileSystemHandle.name.split('.')[0],
        libraryDirectory,
        directoryHandle,
        fileHandle,
      });

      if (fileSystemHandle.kind === 'directory') {
        const { tracks, covers } = await getAllFileHandlesFromDirectory({
          directoryHandle: fileSystemHandle,
          path: handlePath,
          libraryDirectory,
        });
        res.tracks.push(...tracks);
        res.covers.push(...covers);
      } else if (trackMatcher.test(fileSystemHandle.name)) {
        res.tracks.push(getFileHandle(fileSystemHandle));
      } else if (coverMatcher.test(fileSystemHandle.name)) {
        res.covers.push(getFileHandle(fileSystemHandle));
      }
    }
    return res;
  } catch (_) {
    postMessage({ message: 'requestPermission', directoryHandle });
    throw Error();
  }
};
