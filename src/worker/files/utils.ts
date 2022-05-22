import { FileHandle } from './FileHandle';

export const fileHandleIsCover = (fileHandle: FileHandle) => {
  return fileHandle.fileName.toLowerCase() === 'cover';
};
