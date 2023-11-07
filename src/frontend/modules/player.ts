import { useMemo, useEffect, useEventListener, store, $$ } from 'voby';

import {
  appendToArrayUnique,
  getShuffledQueue,
  insertAfterValInArr,
  requestFileAccess,
} from '../utils';
import { onMessage, postMessage } from '../utils/worker';
import { cleanQueue$, state } from './library';

const audioEl = new Audio();

export const currentTrack$ = useMemo(() => state.trackData[state.activeTrackId || -1]);

const currentTrackIndex$ = useMemo(() => $$(cleanQueue$)?.indexOf(state.activeTrackId || -1));
export const isFirst$ = useMemo(() => $$(currentTrackIndex$) === 0);
export const isLast$ = useMemo(() => $$(currentTrackIndex$) === ($$(cleanQueue$)?.length || 0) - 1);

onMessage(({ data }) => {
  if (data.message === 'play') {
    return realPlay(data.trackId, data.queue, data.time);
  }
  if (data.message === 'pause') {
    return realPause();
  }
});

export const play = (trackId?: number, queue?: number[], time?: number) => {
  postMessage({ message: 'play', trackId, ...(queue && { queue: [...queue] }), time });
};

export const realPlay = async (trackId?: number, queue?: number[], time = state.currentTime) => {
  await requestFileAccess();

  const track = state.trackData[trackId || state.activeTrackId || -1];
  if (track && track.id !== +(audioEl.dataset.trackId || -1)) {
    const file = await track.fileHandle.getFile();
    if (trackId) postMessage({ message: 'setGeneralData', state: { activeTrackId: trackId } });

    audioEl.src = URL.createObjectURL(file);
    audioEl.dataset.trackId = track.id.toString();
  }
  if (queue) {
    if (!state.shuffle) {
      postMessage({ message: 'setGeneralData', state: { queue: [...queue] } });
    } else if (!state.originalQueue || queue.toString() !== state.originalQueue.toString()) {
      postMessage({
        message: 'setGeneralData',
        state: { originalQueue: [...queue], queue: getShuffledQueue(queue) },
      });
    }
  }
  if (audioEl.src) {
    audioEl.currentTime = trackId && trackId !== state.activeTrackId ? 0 : time || 0;
    audioEl.play();
  }
};

useEffect(() => {
  if (state.mute === undefined) return;
  audioEl.muted = state.mute;
});

export const pause = () => postMessage({ message: 'pause' });
export const realPause = () => audioEl.pause();
export const go = (offset: number) => {
  if (state.loop === 'track') offset = 0;
  const queue = state.queue || [];
  let nextTrackIndex = ($$(currentTrackIndex$) || 0) + offset;
  if (state.loop === 'queue') {
    if (nextTrackIndex > queue.length - 1) nextTrackIndex = queue.length % nextTrackIndex;
    else if (nextTrackIndex < 0) nextTrackIndex = queue.length + nextTrackIndex;
  }
  if (nextTrackIndex < 0 || nextTrackIndex > queue.length - 1) return;
  play(queue[nextTrackIndex]);
};
export const seek = (time: number) => postMessage({ message: 'play', time });

export const shuffle = (shuffle: boolean) => {
  if (!shuffle) {
    postMessage({
      message: 'setGeneralData',
      state: { shuffle, originalQueue: undefined, queue: store.unwrap(state).originalQueue },
    });
  } else {
    const queue = store.unwrap(state).queue;
    postMessage({
      message: 'setGeneralData',
      state: { shuffle, originalQueue: queue, queue: getShuffledQueue(queue) },
    });
  }
};

const queueKeys: Array<keyof Pick<State, 'queue' | 'originalQueue'>> = ['queue', 'originalQueue'];

export const appendToQueue = (trackId: number) => {
  for (const key of queueKeys) {
    const queue = state[key];
    if (!queue) continue;

    postMessage({
      message: 'setGeneralData',
      state: { [key]: appendToArrayUnique(queue, trackId) },
    });
  }
};

export const playNext = (trackId: number) => {
  if (!state.activeTrackId) return appendToQueue(trackId);

  for (const key of queueKeys) {
    const queue = state[key];
    if (!queue) continue;

    postMessage({
      message: 'setGeneralData',
      state: { [key]: insertAfterValInArr(queue, trackId, state.activeTrackId) },
    });
  }
};

useEventListener(audioEl, 'play', () => {
  postMessage({ message: 'setTemporaryData', state: { playing: true } });
});
useEventListener(audioEl, 'pause', () => {
  postMessage({ message: 'setTemporaryData', state: { playing: false } });
});
useEventListener(audioEl, 'ended', () => go(1));

let animationFrameId: number;
const updateTime = () => {
  animationFrameId = requestAnimationFrame(() => {
    postMessage({ message: 'setGeneralData', state: { currentTime: audioEl.currentTime } });
    updateTime();
  });
};
useEffect(() => {
  if (state.playing && !audioEl.paused) updateTime();
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
    const track = $$(currentTrack$);
    if (!track) {
      mediaSession.metadata = null;
      return;
    }

    mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      ...(track.albumTitle && { album: track.albumTitle }),
      ...(track.images && { artwork: [{ src: track.images.medium }] }),
    });
  });
}
