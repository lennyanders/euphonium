import { getFormattedTime } from '../../shared/utils';

const coverCache: Record<string, string> = {};

export const beToFETrack = (track: DbTrack, covers: DbCover[]): FETrack => {
  let cover: string | undefined;
  if (track.cover) {
    cover = URL.createObjectURL(track.cover);
  } else {
    if (coverCache[track.folderPath]) {
      cover = coverCache[track.folderPath];
    } else {
      const dbCover = covers.find((cover) => cover.folderPath === track.folderPath);
      if (dbCover) {
        cover = URL.createObjectURL(dbCover.image);
        coverCache[track.folderPath] = cover;
      }
    }
  }

  return {
    fileHandle: track.fileHandle,
    id: track.id,
    duration: track.duration,
    durationFormatted: getFormattedTime(track.duration),
    number: track.number,
    count: track.count,
    diskNumber: track.diskNumber,
    diskCount: track.diskCount,
    year: track.year,
    artist: track.artist || 'unknown artist',
    title: track.title || track.fileName,
    albumArtist: track.albumArtist,
    albumTitle: track.albumTitle,
    cover,
  };
};
