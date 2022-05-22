import { FileHandle } from '../files/FileHandle';
import { openDB, DBSchema, IDBPDatabase } from 'idb/with-async-ittr';

export interface DbLibraryDirectory {
  id?: number;
  handle: FileSystemDirectoryHandle;
}

export interface DbTrack extends FileHandle {
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

  /** only for album view in frontend */
  displayDiskNumber?: boolean;
}

export interface DbCover extends FileHandle {
  id?: number;
  image: Blob;
}

export interface AppDataDb extends DBSchema {
  libraryDirectory: {
    key: number;
    value: DbLibraryDirectory;
  };
  track: {
    key: number;
    value: DbTrack;
    indexes: { libraryDirectory: number };
  };
  cover: {
    key: number;
    value: DbCover;
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

      const coverStore = db.createObjectStore('cover', { keyPath: 'id', autoIncrement: true });
      coverStore.createIndex('libraryDirectory', 'libraryDirectory');
    },
  });

  return database;
};
