import { Cover } from '../database';
import { FileHandle } from './FileHandle';

export const getCover = async (fileHandle: FileHandle): Promise<Cover | null> => {
  try {
    const file = await fileHandle.fileHandle.getFile();
    const imageData = new Uint8ClampedArray(await file.arrayBuffer());
    const image = new Blob([imageData], { type: file.type });
    return { ...fileHandle, image };
  } catch (error) {
    console.error(error);
    return null;
  }
};
