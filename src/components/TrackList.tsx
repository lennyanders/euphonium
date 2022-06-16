import { Virtualizer } from '@tanstack/virtual-core';
import { $, $$, If, useComputed, useEffect, ObservableMaybe } from 'voby';
import { state } from '../modules/library';
import { play } from '../modules/player';
import { CoverImage } from './CoverImage';
import { Virtual, VirtualProps } from './Virtual/Index';

export const TrackList = ({
  trackIds,
  showNumber,
  showIndex,
  stickToActiveTrack,
  showDiskOnTracks,
}: {
  trackIds: ObservableMaybe<number[]>;
  showNumber?: boolean;
  showIndex?: boolean;
  showDiskOnTracks?: ObservableMaybe<number[]>;
  stickToActiveTrack?: boolean;
}) => {
  const props: Omit<VirtualProps<FETrack>, 'children'> = {
    items: useComputed(() => $$(trackIds).map((id) => state.trackData[id])),
    overscan: 25,
    size: (track) => ($$(showDiskOnTracks)?.includes(track.id) ? 80 : 56),
    ulClass: 'm--1',
  };
  if (stickToActiveTrack) {
    const virtualizer$ = $<Virtualizer<Window & typeof globalThis, any>>();
    props.ref = virtualizer$;
    useEffect(() => {
      const index = $$(trackIds).indexOf(state.activeTrackId!);
      if (index > -1) virtualizer$()?.scrollToIndex(index, { align: 'start' });
    });
  }

  return (
    <Virtual {...props}>
      {(track, index) => (
        <>
          <If when={() => $$(showDiskOnTracks)?.includes(track().id)}>
            Disk: {() => track().diskNumber}
          </If>
          <button
            class={[
              'w-100% flex gap-2 items-center p-1 rd-1 min-h-14',
              () => state.activeTrackId === track().id && 'bg-dark-200',
            ]}
            onClick={() => play(track().id, $$(trackIds))}
          >
            <If when={showNumber}>
              <span
                class='shrink-0'
                style={{
                  width: `${
                    Math.floor($$(trackIds).length / ($$(showDiskOnTracks)?.length || 1)).toString()
                      .length
                  }ch`,
                }}
              >
                {() => track().number || '-'}
              </span>
            </If>
            <If when={!showNumber && showIndex}>
              <span
                class='shrink-0'
                style={{ width: `${$$(trackIds).length.toString().length}ch` }}
              >
                {index + 1}
              </span>
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
