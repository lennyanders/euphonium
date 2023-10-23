import { getFormattedTime } from '../../shared/utils';

const coverCache: Record<string, FEImages> = {};

const beToFeImages = (beImages: BEImages) => {
  return Object.fromEntries(
    Object.entries(beImages).map(([name, size]) => [name, URL.createObjectURL(size)]),
  ) as FEImages;
};

export const beToFETrack = (track: DbTrack, covers: DbCover[]): FETrack => {
  let images: FEImages | undefined;
  if (track.images) {
    images = beToFeImages(track.images);
  } else {
    if (coverCache[track.folderPath]) {
      images = coverCache[track.folderPath];
    } else {
      const dbCover = covers.find((cover) => cover.folderPath === track.folderPath);
      if (dbCover?.images) {
        images = beToFeImages(dbCover.images);
        coverCache[track.folderPath] = images;
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
    images,
  };
};
