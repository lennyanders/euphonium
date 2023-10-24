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

export type TypedMessageEvent<T extends string, U extends object = {}> = MessageEvent<
  U & { message: T }
>;

export type MessageEventPostWorker =
  | TypedMessageEvent<'setState', { state: State }>
  | TypedMessageEvent<'setTrackData', { state: Record<number, FETrack> }>
  | TypedMessageEvent<'setAlbumData', { state: Record<string, FEAlbum> }>
  | TypedMessageEvent<'setArtistData', { state: Record<string, FEArtist> }>
  | TypedMessageEvent<'setLibraryDirectories', { state: FELibraryDirectory[] }>
  | TypedMessageEvent<'setGeneralData', { state: GeneralData }>
  | TypedMessageEvent<'setTemporaryData', { state: TemporaryData }>
  | TypedMessageEvent<'requestPermission', { directoryHandle: FileSystemDirectoryHandle }>
  | TypedMessageEvent<'tryAddDirectoryToLibrary', { relation: Relation }>;

export type MessageEventPostFrontend =
  | TypedMessageEvent<'reloadLibrary'>
  | TypedMessageEvent<'removeLibraryDirectory', { id: number }>
  | TypedMessageEvent<'tryAddDirectoryToLibrary', { directoryHandle: FileSystemDirectoryHandle }>
  | TypedMessageEvent<
      'forceAddDirectoryToLibrary',
      { relation: Relation; directoryHandle: FileSystemDirectoryHandle }
    >
  | TypedMessageEvent<'setGeneralData', { state: GeneralData }>;
