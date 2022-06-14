export enum DirectoryRelationType {
  DirectoryIsNew,
  DirectoryIsAlreadyImportet,
  DirectoryIsInsideImportetDirectory,
  DirectoryIsParentOfImportetDirectories,
}

export type Relation =
  | { type: DirectoryRelationType.DirectoryIsNew }
  | { type: DirectoryRelationType.DirectoryIsAlreadyImportet; id: number }
  | { type: DirectoryRelationType.DirectoryIsInsideImportetDirectory; id: number }
  | {
      type: DirectoryRelationType.DirectoryIsParentOfImportetDirectories;
      parentOfDirectories: { id: number; pathDifference: string[] }[];
    };

export type WME<T extends string, U extends object = {}> = MessageEvent<U & { message: T }>;

export type MWME =
  | WME<'setState', { state: State }>
  | WME<'setTrackData', { state: Record<number, FETrack> }>
  | WME<'setTracks', { state: number[] }>
  | WME<'setAlbums', { state: string[] }>
  | WME<'setArtists', { state: FEArtist[] }>
  | WME<'setLibraryDirectories', { state: FELibraryDirectory[] }>
  | WME<'setGeneralData', { state: GeneralData }>
  | WME<'requestPermission', { directoryHandle: FileSystemDirectoryHandle }>
  | WME<'tryAddDirectoryToLibrary', { relation: Relation }>;

export type WWME =
  | WME<'reloadLibrary'>
  | WME<'removeLibraryDirectory', { id: number }>
  | WME<'tryAddDirectoryToLibrary', { directoryHandle: FileSystemDirectoryHandle }>
  | WME<
      'forceAddDirectoryToLibrary',
      { relation: Relation; directoryHandle: FileSystemDirectoryHandle }
    >
  | WME<'setGeneralData', { state: GeneralData }>;
