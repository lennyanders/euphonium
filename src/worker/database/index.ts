import { openDB, DBSchema, IDBPDatabase } from 'idb/with-async-ittr';

export interface Track {
  id?: number;
  filePath: string;
  fileName: string;
  fileModified?: number;
  fileHandle: FileSystemFileHandle;
  directoryHandle: FileSystemDirectoryHandle;
  libraryDirectory: number;
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
}

export interface AppDataDb extends DBSchema {
  libraryDirectory: {
    key: number;
    value: { id?: number; handle: FileSystemDirectoryHandle };
  };
  track: {
    key: number;
    value: Track;
    indexes: { libraryDirectory: number };
  };
}

let database: IDBPDatabase<AppDataDb>;
export const getDatabase = async () => {
  if (database) return database;

  database = await openDB<AppDataDb>('AppData', 1, {
    upgrade(db) {
      db.createObjectStore('libraryDirectory', { keyPath: 'id', autoIncrement: true });

      const trackStore = db.createObjectStore('track', { keyPath: 'id', autoIncrement: true });
      trackStore.createIndex('libraryDirectory', 'libraryDirectory');
    },
  });

  return database;
};
