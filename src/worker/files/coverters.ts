import { getFormattedTime } from '../../shared/utils';

export const beToFETrack = (track: DbTrack): FETrack => {
  let cover: string | undefined;
  if (track.cover) cover = URL.createObjectURL(track.cover);
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
