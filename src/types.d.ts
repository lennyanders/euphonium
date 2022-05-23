interface FileHandle {
  filePath: string;
  folderPath: string;
  fileName: string;
  fileModified?: number;
  fileHandle: FileSystemFileHandle;
  directoryHandle: FileSystemDirectoryHandle;
  libraryDirectory: number;
}

interface DbTrack extends FileHandle {
  id?: number;
  duration: number;
  number?: number;
  count?: number;
  diskNumber?: number;
  diskCount?: number;
  year?: number;
  artist?: string;
  title?: string;
  albumArtist?: string;
  albumTitle?: string;
  cover?: Blob;
}

interface DbCover extends FileHandle {
  id?: number;
  image: Blob;
}

interface FELibraryDirectory {
  id: number;
  name: string;
  directoryHandle: FileSystemDirectoryHandle;
}

type FETrack = Omit<
  DbTrack,
  | 'cover'
  | 'filePath'
  | 'folderPath'
  | 'fileName'
  | 'fileModified'
  | 'directoryHandle'
  | 'libraryDirectory'
  | 'title'
> & {
  title: string;
  cover?: string;
  durationFormatted: string;
};

interface FEAlbum {
  title: string;
  artist: string;
  year?: number;
  tracks: number[];
  diskCount: number;
  duration: number;
  durationFormatted: string;
  cover?: string;
}

interface Library {
  libraryDirectories: FELibraryDirectory[];
  tracks: FETrack[];
  albums: FEAlbum[];
}
