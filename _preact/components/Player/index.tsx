import { useState, useEffect, useContext } from 'preact/hooks';
import {
  mdiPlay,
  mdiPause,
  mdiSkipPrevious,
  mdiSkipNext,
  mdiVolumeHigh,
  mdiVolumeLow,
  mdiVolumeMedium,
  mdiShuffle,
  mdiRepeat,
  mdiChevronUp,
} from '@mdi/js';
import { Icon } from '../icon';
import { Progress } from '../Progress';
import { getFormattedTime, Props } from '../../utils';
import { Store } from '../../store';
import {
  playerClass,
  progressClass,
  playerBottomClass,
  otherOptionsClass,
  controlsClass,
  volumeClass,
  mutedClass,
} from './index.css';
import { BasicTrackInfo } from '../BasicTrackInfo';

const EVENT_OPTS = { passive: true, capture: true };
const audio = new Audio();

const Button = ({ path, ...props }: Props<HTMLButtonElement, { path: string; class?: string }>) => (
  <button>
    <Icon path={path} />
  </button>
);

export const Player = () => {
  const {
    tracks: [track],
  } = useContext(Store)!;
  if (!track) return <></>;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0);

  const updateIsMuted = () => setIsMuted(audio.muted);
  const updateProgress = () => setProgress(audio.currentTime);
  const updateVolume = () => setVolume(audio.volume);

  let progressAnimationFrame = 0;
  const updateIsPlaying = () => {
    const newIsPlaying = !audio.paused;
    setIsPlaying(newIsPlaying);

    if (newIsPlaying) updateProgressState();
    else cancelAnimationFrame(progressAnimationFrame);
  };
  const updateProgressState = () => {
    updateProgress();
    progressAnimationFrame = requestAnimationFrame(updateProgressState);
  };

  const playPause = async () => {
    if (isPlaying) return audio.pause();

    if (!audio.src) {
      const permission = await track.fileHandle.requestPermission();
      if (permission !== 'granted') return;

      audio.src = URL.createObjectURL(await track.fileHandle.getFile());
    }
    audio.play();
  };
  const muteUnmute = () => (audio.muted = !audio.muted);
  const setProgressUI = (event: Event) => {
    audio.currentTime = +(event.target as HTMLInputElement).value;
    if (!isPlaying) updateProgress();
  };
  const setVolumeUI = (event: Event) => (audio.volume = +(event.target as HTMLInputElement).value);

  useEffect(() => {
    audio.volume = 0.25;

    audio.addEventListener('durationchange', updateProgress, EVENT_OPTS);
    updateProgress();

    audio.addEventListener('play', updateIsPlaying, EVENT_OPTS);
    audio.addEventListener('pause', updateIsPlaying, EVENT_OPTS);
    updateIsPlaying();

    audio.addEventListener('volumechange', updateIsMuted, EVENT_OPTS);
    audio.addEventListener('volumechange', updateVolume, EVENT_OPTS);
    updateIsMuted();
    updateVolume();

    return () => {
      audio.removeEventListener('durationchange', updateProgress, EVENT_OPTS);
      audio.removeEventListener('play', updateIsPlaying, EVENT_OPTS);
      audio.removeEventListener('pause', updateIsPlaying, EVENT_OPTS);
      audio.removeEventListener('volumechange', updateIsMuted, EVENT_OPTS);
      audio.removeEventListener('volumechange', updateVolume, EVENT_OPTS);
    };
  }, []);

  return (
    <div class={playerClass}>
      <div class={progressClass}>
        <span>{getFormattedTime(progress)}</span>
        <Progress
          value={progress}
          max={Math.floor(track.duration)}
          onInput={setProgressUI}
          title='progress'
        />
        <span>{getFormattedTime(track.duration)}</span>
      </div>
      <div class={playerBottomClass}>
        <BasicTrackInfo track={track} />
        <div class={controlsClass}>
          <Button path={mdiShuffle} />
          <Button path={mdiSkipPrevious} />
          <Button onClick={playPause} path={isPlaying ? mdiPause : mdiPlay} />
          <Button path={mdiSkipNext} />
          <Button path={mdiRepeat} />
        </div>
        <div class={otherOptionsClass}>
          <Progress
            class={volumeClass}
            value={volume}
            max={1}
            step={0.01}
            onInput={setVolumeUI}
            title='volume'
          />
          <Button
            class={isMuted ? mutedClass : ''}
            onClick={muteUnmute}
            path={volume < 0.25 ? mdiVolumeLow : volume > 0.75 ? mdiVolumeHigh : mdiVolumeMedium}
          />
          <Button path={mdiChevronUp} />
        </div>
      </div>
    </div>
  );
};
