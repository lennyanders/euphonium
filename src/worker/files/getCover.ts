import { FileHandle } from './FileHandle';
import { getOptimizedImages } from './getOptimizedImage';

export const getCover = async (fileHandle: FileHandle): Promise<DbCover | null> => {
  try {
    const file = await fileHandle.fileHandle.getFile();
    const [image, imagePreview] = await getOptimizedImages(file);
    return { ...fileHandle, fileModified: file.lastModified, image, imagePreview };
  } catch (error) {
    console.error(error);
    return null;
  }
};
