import { openDB, DBSchema, IDBPDatabase } from 'idb/with-async-ittr';

export interface EuphoniumFileHandle {
  id?: number;
  path: string;
  rootDirectory: number;
  directoryHandle: FileSystemDirectoryHandle;
  fileHandle: FileSystemFileHandle;
}

export interface AppDataDb extends DBSchema {
  libraryDirectoryHandle: {
    key: number;
    value: { id?: number; handle: FileSystemDirectoryHandle };
  };
  fileHandle: {
    key: number;
    value: EuphoniumFileHandle;
    indexes: { rootDirectory: number };
  };
}

let database: IDBPDatabase<AppDataDb>;
export const getDatabase = async () => {
  if (database) return database;

  database = await openDB<AppDataDb>('AppData', 1, {
    upgrade(db) {
      db.createObjectStore('libraryDirectoryHandle', { keyPath: 'id', autoIncrement: true });

      const fileHandleStore = db.createObjectStore('fileHandle', {
        keyPath: 'id',
        autoIncrement: true,
      });
      fileHandleStore.createIndex('rootDirectory', 'rootDirectory');
    },
  });

  return database;
};
