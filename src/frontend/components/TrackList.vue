<script setup lang="ts">
  import { useWindowVirtualizer } from '@tanstack/vue-virtual';
  import { computed } from 'vue';

  import { state } from '../modules/library';
  import { remToPx } from '../utils/rem-to-px';
  import CoverImage from './CoverImage.vue';

  const props = defineProps<{ tracks: FeTrack[] }>();

  const size = remToPx(3.5);
  const rowVirtualizer = useWindowVirtualizer(
    computed(() => ({
      count: props.tracks.length,
      estimateSize: () => size,
      overscan: 25,
      onchange: console.log,
    })),
  );

  const virtualRows = computed(() => {
    return rowVirtualizer.value
      .getVirtualItems()
      .map((value) => ({ ...value, track: props.tracks[value.index] }));
  });
</script>

<template>
  <ul :style="{ height: `${rowVirtualizer.getTotalSize()}px` }">
    <li
      v-for="virtualRow in virtualRows"
      :key="virtualRow.index"
      :style="{
        blockSize: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
      }"
      :class="{ activeTrack: state.activeTrackId === virtualRow.track.id }"
    >
      <button>
        <CoverImage class="image" :src="virtualRow.track.images?.small" />
        <div>
          {{ virtualRow.track.title }}
          <small>{{ virtualRow.track.artist }}</small>
        </div>
        <span class="duration">{{ virtualRow.track.durationFormatted }}</span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
  ul {
    position: relative;
    margin: -0.25rem;
  }

  li {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    inline-size: 100%;
  }

  button {
    inline-size: 100%;
    block-size: 100%;
    padding: 0.25rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  small {
    display: block;
  }

  .image {
    block-size: 100%;
    inline-size: auto;
  }

  .duration {
    margin-inline-start: auto;
  }
</style>
