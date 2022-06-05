import {
  observeWindowOffset,
  observeWindowRect,
  Virtualizer,
  windowScroll,
} from '@tanstack/virtual-core';
import { $, For, If, useEffect } from 'voby';
import { currentTrackId$, play } from '../modules/player';
import { CoverImage } from './CoverImage';

const Track = ({
  tracks,
  track,
  displayNumber,
}: {
  tracks: FETrack[];
  track: FETrack;
  displayNumber?: boolean;
}) => (
  <button
    class={[
      'w-100% flex gap-2 items-center p-1 rd-1 min-h-14',
      () => currentTrackId$() === track.id && 'bg-[#333]',
    ]}
    onClick={() => play(track, tracks)}
  >
    {displayNumber && <span class='w-2ch text-center shrink-0'>{track.number || '-'}</span>}
    <CoverImage src={track.cover} class='w-12 h-12 rd-1 shrink-0' />
    <div class='break-all truncate'>
      {track.title}
      <small class='block'>{track.artist}</small>
    </div>
    <span class='m-l-a'>{track.durationFormatted}</span>
  </button>
);

export const TrackList = ({
  tracks,
  displayNumber,
  stickToActiveTrack,
}: {
  tracks: FETrack[];
  displayNumber?: boolean;
  stickToActiveTrack?: boolean;
}) => {
  const virtualizer = new Virtualizer({
    count: tracks.length,
    overscan: 50,
    getScrollElement: () => window,
    estimateSize: (index) => (tracks[index].showDiskNumber ? 80 : 56),
    observeElementRect: observeWindowRect,
    observeElementOffset: observeWindowOffset,
    scrollToFn: windowScroll,
    onChange: () => {
      virtualItems$(virtualizer.getVirtualItems());
    },
  });
  const virtualHeight$ = $(virtualizer.getTotalSize());
  const virtualItems$ = $(virtualizer.getVirtualItems(), {
    equals: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
  useEffect(() => {
    virtualItems$();
    virtualizer._willUpdate();
  });
  if (stickToActiveTrack) {
    useEffect(() => {
      const currentTrackId = currentTrackId$();
      const index = tracks.findIndex((track) => track.id === currentTrackId);
      if (index > -1) virtualizer.scrollToIndex(index, { align: 'start' });
    });
  }

  return (
    <ul class='relative m--1' style={{ height: virtualHeight$ }}>
      <For values={virtualItems$}>
        {({ index, start }, track = tracks[index]) => (
          <>
            <If when={track.showDiskNumber}>
              <li
                class='absolute top-0 left-0 w-100%'
                style={{ transform: `translateY(${start}px)` }}
              >
                Disk: {track.diskNumber}
              </li>
            </If>
            <li
              class='absolute top-0 left-0 w-100%'
              style={{
                transform: `translateY(${track.showDiskNumber ? start + 24 : start}px)`,
              }}
            >
              <Track track={track} displayNumber={displayNumber} tracks={tracks} />
            </li>
          </>
        )}
      </For>
    </ul>
  );
};
