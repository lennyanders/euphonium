import { $, useEffect, useSample } from 'voby';
import { Track } from '../worker/database';
import { library } from './library';

const audioEl = new Audio();

export const playing = $(false);
export const currentTrack = $<Track>();

useEffect(() => {
  const { tracks } = library();
  if (!tracks.length || useSample(currentTrack)) return;
  currentTrack(tracks[0]);
});

let first = true;
export const play = async (track?: Track) => {
  if (first) {
    const { libraryDirectories } = library();
    for (const directory of libraryDirectories) {
      await directory.directoryHandle.requestPermission();
    }
    first = false;
  }
  if (!audioEl.src && !track) track = useSample(currentTrack);
  if (track) {
    try {
      const file = await track.fileHandle.getFile();
      currentTrack(track);
      audioEl.src = URL.createObjectURL(file);
    } catch (_) {
      if ((await track.fileHandle.requestPermission()) === 'granted') play(track);
    }
  }
  if (audioEl.src) audioEl.play();
};

export const pause = () => {
  audioEl.pause();
};

audioEl.addEventListener('play', () => {
  playing(true);
});

audioEl.addEventListener('pause', () => {
  playing(false);
});
