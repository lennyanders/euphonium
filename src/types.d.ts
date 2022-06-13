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

type DbGeneralData = Partial<{
  queue: number[];
  activeTrackId: number;
  volume: number;
  mute: boolean;
  shuffle: boolean;
  loop: 'none' | 'track' | 'queue';
}>;

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
  showDiskNumber?: boolean;
};

interface FEAlbum {
  title: string;
  artist: string;
  year?: number;
  cover?: string;
  tracks: FETrack[];
  diskCount: number;
  duration: number;
  durationFormatted: string;
}

interface FEArtist {
  name: string;
  image?: string;
  albums: FEAlbum[];
  singles: FETrack[];
  trackCount: number;
  duration: number;
  durationFormatted: string;
}

type FEGeneralData = Partial<{
  queue: FETrack[];
  activeTrackId: number;
  volume: number;
  mute: boolean;
  shuffle: boolean;
  loop: 'none' | 'track' | 'queue';
}>;

type FEState = Partial<
  {
    libraryDirectories: FELibraryDirectory[];
    tracks: FETrack[];
    albums: FEAlbum[];
    artists: FEArtist[];
    loading: boolean;
  } & FEGeneralData
>;
