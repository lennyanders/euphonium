import { DirectoryRelationType, Relation } from '../../shared/workerFeCommunicationTypes';
import { getDatabase } from '../database';

export const getDirectoryRelation = async (
  directoryHandle: FileSystemDirectoryHandle,
): Promise<Relation> => {
  const database = await getDatabase();
  const parentOfDirectories: { id: number; pathDifference: string[] }[] = [];
  for (const { id, handle } of await database.getAll('libraryDirectory')) {
    if (directoryHandle.name === handle.name && (await directoryHandle.isSameEntry(handle))) {
      return { type: DirectoryRelationType.DirectoryIsAlreadyImportet, id: id! };
    }

    if (await handle.resolve(directoryHandle)) {
      return { type: DirectoryRelationType.DirectoryIsInsideImportetDirectory, id: id! };
    }

    const pathDifference = await directoryHandle.resolve(handle);
    if (pathDifference) parentOfDirectories.push({ id: id!, pathDifference });
  }

  if (parentOfDirectories.length) {
    return {
      type: DirectoryRelationType.DirectoryIsParentOfImportetDirectories,
      parentOfDirectories,
    };
  }

  return { type: DirectoryRelationType.DirectoryIsNew };
};
