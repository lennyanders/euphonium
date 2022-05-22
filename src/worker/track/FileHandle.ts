export interface FileHandle {
  filePath: string;
  fileName: string;
  fileModified?: number;
  fileHandle: FileSystemFileHandle;
  directoryHandle: FileSystemDirectoryHandle;
  libraryDirectory: number;
}
