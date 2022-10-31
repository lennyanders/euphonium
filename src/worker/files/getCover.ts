import { FileHandle } from './FileHandle';
import { getOptimizedImage } from './getOptimizedImage';

export const getCover = async (fileHandle: FileHandle): Promise<DbCover | null> => {
  try {
    const file = await fileHandle.fileHandle.getFile();
    const imageData = new Uint8ClampedArray(await file.arrayBuffer());
    const image = await getOptimizedImage(new Blob([imageData], { type: file.type }), 1080);
    const imagePreview = await getOptimizedImage(new Blob([imageData], { type: file.type }), 96);
    return { ...fileHandle, image, imagePreview };
  } catch (error) {
    console.error(error);
    return null;
  }
};
