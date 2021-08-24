import { Buffer } from 'buffer';
// @ts-ignore
globalThis.Buffer = Buffer;

import { parseBuffer } from 'music-metadata';
import { Track } from '../database';
import { FileHandle } from './FileHandle';

export const getTrack = async (fileHandle: FileHandle): Promise<Track> => {
  try {
    const file = await fileHandle.fileHandle.getFile();
    const { format, common } = await parseBuffer(new Uint8Array(await file.arrayBuffer()));

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
    };
  } catch {
    return fileHandle;
  }
};
