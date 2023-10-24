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

interface DbEntry {
  id?: number;
}

interface DbLibraryDirectory extends DbEntry {
  handle: FileSystemDirectoryHandle;
}

interface DbImages {
  small: Blob;
  medium: Blob;
  large: Blob;
}

type FeImages = Record<keyof DbImages, string>;

interface DbTrack extends DbFileHandle, DbEntry {
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
  images?: DbImages;
}

interface DbCover extends DbFileHandle, DbEntry {
  images?: DbImages;
}

interface FeLibraryDirectory {
  id: number;
  name: string;
  directoryHandle: FileSystemDirectoryHandle;
}

interface FeTrack extends Omit<DbTrack, 'images' | keyof Omit<DbFileHandle, 'fileHandle'>> {
  id: number;
  title: string;
  durationFormatted: string;
  images?: FeImages;
}

interface FeAlbum {
  title: string;
  artist: string;
  year?: number;
  images?: FeImages;
  tracks: number[];
  showDiskOnTracks: number[];
  diskCount: number;
  duration: number;
  durationFormatted: string;
}

interface FeArtist {
  name: string;
  images?: FeImages;
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
  trackData: Record<number, FeTrack>;
  albumData: Record<string, FeAlbum>;
  artistData: Record<string, FeArtist>;
  libraryDirectories: FeLibraryDirectory[];
  loading: boolean;
}
