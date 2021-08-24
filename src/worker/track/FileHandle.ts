import { Track } from '../database';

export type FileHandle = Pick<
  Track,
  'filePath' | 'fileName' | 'fileModified' | 'fileHandle' | 'directoryHandle' | 'libraryDirectory'
>;
