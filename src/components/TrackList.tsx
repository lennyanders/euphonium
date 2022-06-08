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
  const { virtualizer, virtualHeight$, virtualItemsIndexes$, virtualItemsIndexesToStart$ } =
    useVirtual({
      count: tracks.length,
      overscan: 25,
      estimateSize: (index) => (tracks[index].showDiskNumber ? 80 : 56),
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
      <For values={virtualItemsIndexes$}>
        {(item) => (
          <>
            <If when={() => tracks[item].showDiskNumber}>
              <li
                class='absolute top-0 left-0 w-100%'
                style={{
                  transform: () => `translateY(${virtualItemsIndexesToStart$()[item]}px)`,
                }}
              >
                Disk: {() => tracks[item].diskNumber}
              </li>
            </If>
            <li
              class='absolute top-0 left-0 w-100%'
              style={{
                transform: () =>
                  `translateY(${
                    virtualItemsIndexesToStart$()[item] + (tracks[item].showDiskNumber ? 24 : 0)
                  }px)`,
              }}
            >
              <button
                class={[
                  'w-100% flex gap-2 items-center p-1 rd-1 min-h-14',
                  () => currentTrackId$() === tracks[item].id && 'bg-[#333]',
                ]}
                onClick={() => play(tracks[item], tracks)}
              >
                {displayNumber && (
                  <span class='w-2ch text-center shrink-0'>{() => tracks[item].number || '-'}</span>
                )}
                <CoverImage
                  src={() => tracks[item].cover!}
                  css='w-12 h-12 rd-1 shrink-0 background-size-125%'
                />
                <div class='break-all truncate'>
                  {() => tracks[item].title}
                  <small class='block'>{() => tracks[item].artist}</small>
                </div>
                <span class='m-l-a self-start p-r-1'>{() => tracks[item].durationFormatted}</span>
              </button>
            </li>
          </>
        )}
      </For>
    </ul>
  );
};
