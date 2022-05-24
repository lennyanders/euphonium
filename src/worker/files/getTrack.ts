import { Buffer } from 'buffer';
// @ts-ignore
globalThis.Buffer = Buffer;

import { parseBuffer } from 'music-metadata';
import { FileHandle } from './FileHandle';
import { getOptimizedImage } from './getOptimizedImage';

export const getTrack = async (fileHandle: FileHandle): Promise<DbTrack | null> => {
  try {
    const file = await fileHandle.fileHandle.getFile();
    const { format, common } = await parseBuffer(
      new Uint8Array(await file.arrayBuffer()),
      { mimeType: file.type, size: file.size },
      { duration: true, skipCovers: false },
    );

    let cover: Blob | undefined;
    if (common.picture?.length) {
      const [image] = common.picture;
      const imageData = new Uint8ClampedArray(image.data);
      cover = await getOptimizedImage(new Blob([imageData], { type: image.type }));
    }

    return {
      ...fileHandle,
      fileModified: file.lastModified,
      duration: format.duration!,
      number: common.track.no ?? undefined,
      count: common.track.of ?? undefined,
      diskNumber: common.disk.no ?? undefined,
      diskCount: common.disk.of ?? undefined,
      year: common.year,
      artist: common.artist,
      title: common.title,
      albumArtist: common.albumartist,
      albumTitle: common.album,
      cover,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
