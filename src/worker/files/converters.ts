import { getFormattedTime } from '../../shared/utils';

const coverCache: Record<string, { cover: string; coverPreview: string }> = {};

export const beToFETrack = (track: DbTrack, covers: DbCover[]): FETrack => {
  let cover: string | undefined;
  let coverPreview: string | undefined;
  if (track.cover && track.coverPreview) {
    cover = URL.createObjectURL(track.cover);
    coverPreview = URL.createObjectURL(track.coverPreview);
  } else {
    if (coverCache[track.folderPath]) {
      cover = coverCache[track.folderPath].cover;
      coverPreview = coverCache[track.folderPath].coverPreview;
    } else {
      const dbCover = covers.find((cover) => cover.folderPath === track.folderPath);
      if (dbCover) {
        cover = URL.createObjectURL(dbCover.image);
        coverPreview = URL.createObjectURL(dbCover.imagePreview);
        coverCache[track.folderPath] = { cover, coverPreview };
      }
    }
  }

  return {
    fileHandle: track.fileHandle,
    id: track.id!,
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
    coverPreview,
  };
};
