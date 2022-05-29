import { $, useComputed, useEffect, useEventListener, useSample } from 'voby';
import { requestFileAccess } from '../utils';
import { tracks$ } from './library';

const audioEl = new Audio();

export const playing$ = $(false);
export const queue$ = $<FETrack[]>();
const currentTrackId$ = $<number>();
export const currentTime$ = $(0);
export const currentTrack$ = useComputed(() => {
  const id = currentTrackId$();
  return queue$()?.find((track) => track.id === id);
});
const currentTrackIndex$ = useComputed(() => {
  const id = currentTrackId$();
  return queue$()?.findIndex((track) => track.id === id);
});
export const isFirst$ = useComputed(() => currentTrackIndex$() === 0);
export const isLast$ = useComputed(() => currentTrackIndex$() === (queue$()?.length || 0) - 1);

const dispose = useEffect(() => {
  const tracks = tracks$();
  if (!tracks?.length || useSample(currentTrack$)) return;
  queue$(tracks);
  currentTrackId$(tracks[0].id);
  dispose();
});

export const play = async (track?: FETrack, queue?: FETrack[]) => {
  await requestFileAccess();
  if (queue) queue$(queue);
  if (!audioEl.src && !track) track = useSample(currentTrack$);
  if (track) {
    try {
      const file = await track.fileHandle.getFile();
      currentTrackId$(track.id);
      audioEl.src = URL.createObjectURL(file);
    } catch (_) {
      if ((await track.fileHandle.requestPermission()) === 'granted') play(track);
    }
  }
  if (audioEl.src) audioEl.play();
};

export const pause = () => audioEl.pause();
export const go = (offset: number) => {
  const queue = queue$() || [];
  const nextTrackIndex = (currentTrackIndex$() || 0) + offset;
  if (nextTrackIndex < 0 || nextTrackIndex > queue.length) return;
  play(queue[nextTrackIndex]);
};

useEventListener(audioEl, 'play', () => playing$(true));
useEventListener(audioEl, 'pause', () => playing$(false));

let animationFrameId: number;
const updateTime = () => {
  animationFrameId = requestAnimationFrame(() => {
    currentTime$(audioEl.currentTime);
    updateTime();
  });
};
useEffect(() => {
  if (playing$()) updateTime();
  else cancelAnimationFrame(animationFrameId);
});
