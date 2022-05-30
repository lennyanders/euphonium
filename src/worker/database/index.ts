import { openDB, DBSchema, IDBPDatabase } from 'idb/with-async-ittr';

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
  queue: {
    key: number;
    value: DbQueue;
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

      db.createObjectStore('queue');
    },
  });

  return database;
};
