import { $, useComputed, useEffect, useEventListener } from 'voby';
import { getShuffledQueue, requestFileAccess, uw } from '../utils';
import { postMessage } from '../utils/worker';
import { state } from './library';

const audioEl = new Audio();

export const queue$ = useComputed(() => {
  if (!state.queue) return [];
  if (!state.shuffle) return state.queue;
  return getShuffledQueue();
});
export const playing$ = $(false);
export const currentTime$ = $(0);
export const currentTrack$ = useComputed(() => state.trackData[state.activeTrackId || -1]);

const currentTrackIndex$ = useComputed(() => queue$()?.indexOf(state.activeTrackId || -1));
export const isFirst$ = useComputed(() => currentTrackIndex$() === 0);
export const isLast$ = useComputed(() => currentTrackIndex$() === (queue$()?.length || 0) - 1);

export const play = async (trackId?: number, queue?: number[]) => {
  await requestFileAccess();
  if (queue) state.queue = queue;
  if ((trackId && trackId !== state.activeTrackId) || !audioEl.src) {
    const track = state.trackData[trackId || state.activeTrackId || -1];
    if (track) {
      const file = await track.fileHandle.getFile();
      if (trackId) state.activeTrackId = trackId;
      audioEl.src = URL.createObjectURL(file);
    }
  }
  if (audioEl.src) audioEl.play();
};

useEffect(() => {
  if (!state.queue?.length) return;
  postMessage({ message: 'setGeneralData', state: { queue: uw(state).queue! } });
});
useEffect(() => {
  if (state.activeTrackId === undefined) return;
  postMessage({ message: 'setGeneralData', state: { activeTrackId: state.activeTrackId } });
});
useEffect(() => {
  if (state.shuffle === undefined) return;
  postMessage({ message: 'setGeneralData', state: { shuffle: state.shuffle } });
});
useEffect(() => {
  if (state.loop === undefined) return;
  postMessage({ message: 'setGeneralData', state: { loop: state.loop } });
});
useEffect(() => {
  if (state.volume === undefined) return;
  audioEl.volume = state.volume;
  postMessage({ message: 'setGeneralData', state: { volume: state.volume } });
});
useEffect(() => {
  if (state.mute === undefined) return;
  audioEl.muted = state.mute;
  postMessage({ message: 'setGeneralData', state: { mute: state.mute } });
});

export const pause = () => audioEl.pause();
export const go = (offset: number) => {
  if (state.loop === 'track') offset = 0;
  const queue = queue$() || [];
  let nextTrackIndex = (currentTrackIndex$() || 0) + offset;
  if (state.loop === 'queue') {
    if (nextTrackIndex > queue.length - 1) nextTrackIndex = queue.length % nextTrackIndex;
    else if (nextTrackIndex < 0) nextTrackIndex = queue.length + nextTrackIndex;
  }
  if (nextTrackIndex < 0 || nextTrackIndex > queue.length - 1) return;
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
