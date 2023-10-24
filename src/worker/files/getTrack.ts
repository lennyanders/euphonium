import { Buffer } from 'buffer';
import { parseBuffer } from 'music-metadata';

import { getOptimizedImages } from './getOptimizedImage';

// @ts-ignore
globalThis.Buffer = Buffer;

export const getTrack = async (fileHandle: FileHandle): Promise<DbTrack | null> => {
  try {
    const file = await fileHandle.fileHandle.getFile();
    const { format, common } = await parseBuffer(
      new Uint8Array(await file.arrayBuffer()),
      { mimeType: file.type, size: file.size },
      { duration: true, skipCovers: false },
    );

    let images: BEImages | undefined;
    if (common.picture?.length) {
      const [image] = common.picture;
      const imageData = new Blob([new Uint8ClampedArray(image.data)], { type: image.type });
      images = await getOptimizedImages(imageData);
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
      images,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
