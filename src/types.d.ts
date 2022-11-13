interface FileHandle {
  filePath: string;
  folderPath: string;
  fileName: string;
  fileHandle: FileSystemFileHandle;
  directoryHandle: FileSystemDirectoryHandle;
  libraryDirectory: number;
}

interface DbFileHandle extends FileHandle {
  fileModified: number;
}

interface DbLibraryDirectory {
  id?: number;
  handle: FileSystemDirectoryHandle;
}

interface DbTrack extends DbFileHandle {
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
  coverPreview?: Blob;
}

interface DbCover extends DbFileHandle {
  id?: number;
  image: Blob;
  imagePreview: Blob;
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
  | 'coverPreview'
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
  coverPreview?: string;
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
  artistData: Record<string, FEArtist>;
  libraryDirectories: FELibraryDirectory[];
  loading: boolean;
}
