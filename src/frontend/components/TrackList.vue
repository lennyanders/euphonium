<script setup lang="ts">
  import { MaybeRef, computed, ref, unref } from 'vue';

  import { mainEl } from '../modules/layout';
  import { state } from '../modules/library';
  import { remToPx } from '../utils/rem-to-px';
  import { useVirtual } from '../utils/virtual';
  import CoverImage from './CoverImage.vue';

  const props = defineProps<{
    tracks: MaybeRef<FeTrack[]>;
    showNumber?: boolean;
    showDiskOnTracks?: MaybeRef<number[]>;
  }>();

  const listRef = ref<HTMLUListElement>();

  const diskNumberWith = computed(() => {
    return unref(props.tracks)
      .reduce((res, cur) => {
        const currentNumber = cur.number ?? 0;
        return currentNumber > res ? currentNumber : res;
      }, 0)
      .toString().length;
  });

  const size = remToPx(3);
  const sizeWithDiskCount = remToPx(4.75);
  const gap = remToPx(0.5);
  const { totalSize, virtualRows } = useVirtual<FeTrack>(
    computed(() => ({
      items: unref(props.tracks),
      estimateSize: (track) => {
        return unref(props.showDiskOnTracks)?.includes(track.id) ? sizeWithDiskCount : size;
      },
      scrollRef: mainEl,
      listRef,
      gap,
    })),
  );
</script>

<template>
  <ul :style="{ height: totalSize }" ref="listRef">
    <li
      v-for="virtualRow in virtualRows"
      :key="virtualRow.index"
      :style="{
        blockSize: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
      }"
      :class="{ activeTrack: state.activeTrackId === virtualRow.item.id }"
    >
      <template v-if="unref(props.showDiskOnTracks)?.includes(virtualRow.item.id)">
        Disk: {{ virtualRow.item.diskNumber }}
      </template>
      <button>
        <span v-if="props.showNumber" class="shrink-0" :style="{ width: `${diskNumberWith}ch` }">
          {{ virtualRow.item.number ?? '-' }}
        </span>
        <CoverImage class="image" :src="virtualRow.item.images?.small" />
        <div class="info">
          {{ virtualRow.item.title }}
          <small>{{ virtualRow.item.artist }}</small>
        </div>
        <span class="duration">{{ virtualRow.item.durationFormatted }}</span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
  ul {
    position: relative;
  }

  li {
    position: absolute;
    display: grid;
    grid-auto-rows: 1fr auto;
    grid-auto-columns: 100%;
    inset-block-start: 0;
    inset-inline-start: 0;
    inline-size: 100%;
  }

  button {
    inline-size: 100%;
    block-size: 3rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .info,
  small {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .image {
    flex: 0 0 auto;
    inline-size: auto;
    block-size: 100%;
  }

  .duration {
    margin-inline-start: auto;
  }
</style>
