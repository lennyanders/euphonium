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

interface BEImages {
  small: Blob;
  medium: Blob;
  large: Blob;
}

type FEImages = Record<keyof BEImages, string>;

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
  images?: BEImages;
}

interface DbCover extends DbFileHandle {
  id?: number;
  images?: BEImages;
}

interface FELibraryDirectory {
  id: number;
  name: string;
  directoryHandle: FileSystemDirectoryHandle;
}

type FETrack = Omit<
  DbTrack,
  | 'id'
  | 'images'
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
  durationFormatted: string;
  images?: FEImages;
};

interface FEAlbum {
  title: string;
  artist: string;
  year?: number;
  images?: FEImages;
  tracks: number[];
  showDiskOnTracks: number[];
  diskCount: number;
  duration: number;
  durationFormatted: string;
}

interface FEArtist {
  name: string;
  images?: FEImages;
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

type TemporaryData = Partial<{
  importing: boolean;
}>;

interface State extends GeneralData, TemporaryData {
  trackData: Record<number, FETrack>;
  albumData: Record<string, FEAlbum>;
  artistData: Record<string, FEArtist>;
  libraryDirectories: FELibraryDirectory[];
  loading: boolean;
}
