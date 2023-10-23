import { FileHandle } from './FileHandle';
import { getOptimizedImages } from './getOptimizedImage';

export const getCover = async (fileHandle: FileHandle): Promise<DbCover | null> => {
  try {
    const file = await fileHandle.fileHandle.getFile();
    const images = await getOptimizedImages(file);
    return { ...fileHandle, fileModified: file.lastModified, images };
  } catch (error) {
    console.error(error);
    return null;
  }
};
