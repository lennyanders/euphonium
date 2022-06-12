import { Virtualizer } from '@tanstack/virtual-core';
import { If, useEffect } from 'voby';
import { state } from '../modules/library';
import { play } from '../modules/player';
import { CoverImage } from './CoverImage';
import { Virtual, VirtualProps } from './Virtual/Index';

export const TrackList = ({
  tracks,
  showNumber,
  stickToActiveTrack,
  showDiskNumber,
}: {
  tracks: FETrack[];
  showNumber?: boolean;
  showDiskNumber?: boolean;
  stickToActiveTrack?: boolean;
}) => {
  const props: Omit<VirtualProps<FETrack>, 'children'> = {
    items: tracks,
    overscan: 25,
    size: (track) => (showDiskNumber && track.showDiskNumber ? 80 : 56),
    ulClass: 'm--1',
  };
  if (stickToActiveTrack) {
    props.ref = (virtualizer: Virtualizer<Window & typeof globalThis, any>) => {
      useEffect(() => {
        const id = state.activeTrackId;
        const index = tracks.findIndex((track) => track.id === id);
        if (index > -1) virtualizer.scrollToIndex(index, { align: 'start' });
      });
    };
  }

  return (
    <Virtual {...props}>
      {(track) => (
        <>
          <If when={() => showDiskNumber && track().showDiskNumber}>
            Disk: {() => track().diskNumber}
          </If>
          <button
            class={[
              'w-100% flex gap-2 items-center p-1 rd-1 min-h-14',
              () => state.activeTrackId === track().id && 'bg-[#333]',
            ]}
            onClick={() => play(track(), tracks)}
          >
            <If when={showNumber}>
              <span class='w-2ch text-center shrink-0'>{() => track().number || '-'}</span>
            </If>
            <CoverImage
              src={() => track().cover!}
              css='w-12 h-12 rd-1 shrink-0 background-size-125%'
            />
            <div class='break-all truncate'>
              {() => track().title}
              <small class='block'>{() => track().artist}</small>
            </div>
            <span class='m-l-a self-start p-r-1'>{() => track().durationFormatted}</span>
          </button>
        </>
      )}
    </Virtual>
  );
};
