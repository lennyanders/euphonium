interface FileHandle {
  filePath: string;
  folderPath: string;
  fileName: string;
  fileModified?: number;
  fileHandle: FileSystemFileHandle;
  directoryHandle: FileSystemDirectoryHandle;
  libraryDirectory: number;
}

interface DbLibraryDirectory {
  id?: number;
  handle: FileSystemDirectoryHandle;
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
  | 'id'
  | 'cover'
  | 'filePath'
  | 'folderPath'
  | 'fileName'
  | 'fileModified'
  | 'directoryHandle'
  | 'libraryDirectory'
  | 'title'
> & {
  id: number;
  title: string;
  cover?: string;
  durationFormatted: string;
};

interface FEAlbum {
  title: string;
  artist: string;
  year?: number;
  cover?: string;
  tracks: number[];
  showDiskOnTracks: number[];
  diskCount: number;
  duration: number;
  durationFormatted: string;
}

interface FEArtist {
  name: string;
  image?: string;
  albums: string[];
  singles: number[];
  tracks: number[];
  duration: number;
  durationFormatted: string;
}

type GeneralData = Partial<{
  queue: number[];
  originalQueue: number[];
  activeTrackId: number;
  volume: number;
  mute: boolean;
  shuffle: boolean;
  loop: 'none' | 'track' | 'queue';
}>;

interface State extends GeneralData {
  trackData: Record<number, FETrack>;
  albumData: Record<string, FEAlbum>;
  libraryDirectories?: FELibraryDirectory[];
  artists?: FEArtist[];
  loading?: boolean;
}
