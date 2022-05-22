import { $, useEffect, useSample } from 'voby';
import { requestFileAccess } from '../utils';
import { library } from './library';

const audioEl = new Audio();

export const playing = $(false);
export const currentTrack = $<FETrack>();

useEffect(() => {
  const { tracks } = library();
  if (!tracks.length || useSample(currentTrack)) return;
  currentTrack(tracks[0]);
});

export const play = async (track?: FETrack) => {
  await requestFileAccess();
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
