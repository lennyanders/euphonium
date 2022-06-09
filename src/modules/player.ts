import { $, useComputed, useEffect, useEventListener, useSample } from 'voby';
import { requestFileAccess } from '../utils';
import { postMessage } from '../utils/worker';

const audioEl = new Audio();

export const playing$ = $(false);
export const queue$ = $<FETrack[]>();
export const currentTrackId$ = $<number>();
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

useEffect(() => {
  const state = queue$();
  if (state?.length) postMessage({ message: 'setQueue', state });
});
useEffect(() => {
  const state = currentTrackId$();
  if (state !== undefined) postMessage({ message: 'setActiveTrack', state });
});

export const pause = () => audioEl.pause();
export const go = (offset: number) => {
  const queue = queue$() || [];
  const nextTrackIndex = (currentTrackIndex$() || 0) + offset;
  if (nextTrackIndex < 0 || nextTrackIndex > queue.length) return;
  play(queue[nextTrackIndex]);
};
export const seek = (time: number) => currentTime$((audioEl.currentTime = time));

useEventListener(audioEl, 'play', () => playing$(true));
useEventListener(audioEl, 'pause', () => playing$(false));
useEventListener(audioEl, 'ended', () => go(1));

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

const mediaSession = navigator.mediaSession;
if (mediaSession) {
  mediaSession.setActionHandler('nexttrack', () => go(1));
  mediaSession.setActionHandler('previoustrack', () => go(-1));
  mediaSession.setActionHandler('seekforward', (event) => {
    audioEl.currentTime += event.seekOffset || 10;
  });
  mediaSession.setActionHandler('seekbackward', (event) => {
    audioEl.currentTime -= event.seekOffset || 10;
  });
  mediaSession.setActionHandler('seekto', (event) => {
    if (event.seekTime) audioEl.currentTime = event.seekTime;
  });

  useEffect(() => {
    const track = currentTrack$();
    if (!track) {
      mediaSession.metadata = null;
      return;
    }

    mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      ...(track.albumTitle && { album: track.albumTitle }),
      ...(track.cover && { artwork: [{ src: track.cover }] }),
    });
  });
}
