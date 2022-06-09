import { For, If, useEffect } from 'voby';
import { currentTrackId$, play } from '../modules/player';
import { useVirtual } from '../modules/virtual';
import { CoverImage } from './CoverImage';

export const TrackList = ({
  tracks,
  displayNumber,
  stickToActiveTrack,
}: {
  tracks: FETrack[];
  displayNumber?: boolean;
  stickToActiveTrack?: boolean;
}) => {
  const { virtualizer, virtualHeight$, virtualItems$, virtualItemToStart$ } = useVirtual({
    items: tracks,
    overscan: 25,
    size: (track) => (track.showDiskNumber ? 80 : 56),
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
        {(track) => (
          <li
            class='absolute top-0 left-0 w-100%'
            style={{
              transform: () => `translateY(${virtualItemToStart$().get(track)}px)`,
            }}
          >
            <If when={() => track.showDiskNumber}>Disk: {() => track.diskNumber}</If>
            <button
              class={[
                'w-100% flex gap-2 items-center p-1 rd-1 min-h-14',
                () => currentTrackId$() === track.id && 'bg-[#333]',
              ]}
              onClick={() => play(track, tracks)}
            >
              {displayNumber && (
                <span class='w-2ch text-center shrink-0'>{() => track.number || '-'}</span>
              )}
              <CoverImage
                src={() => track.cover!}
                css='w-12 h-12 rd-1 shrink-0 background-size-125%'
              />
              <div class='break-all truncate'>
                {() => track.title}
                <small class='block'>{() => track.artist}</small>
              </div>
              <span class='m-l-a self-start p-r-1'>{() => track.durationFormatted}</span>
            </button>
          </li>
        )}
      </For>
    </ul>
  );
};
