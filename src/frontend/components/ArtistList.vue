<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { RouterLink } from 'vue-router';

  import { mainEl, mainElWidth } from '../modules/layout';
  import { remToPx } from '../utils/rem-to-px';
  import { useVirtual } from '../utils/virtual';
  import CoverImage from './CoverImage.vue';

  const props = defineProps<{ artists: FeArtist[] }>();

  const listRef = ref<HTMLUListElement>();

  const ulWidth = computed(() => mainElWidth.value + remToPx(0.5));
  const itemsPerRow = computed(() => Math.floor(ulWidth.value / remToPx(15)));
  const itemWidth = computed(() => ulWidth.value / itemsPerRow.value);

  const albums = computed(() => {
    if (!props.artists.length) return [];
    const emptyAlbumsSplitted = Array.from({
      length: Math.ceil(props.artists.length / itemsPerRow.value),
    });
    return emptyAlbumsSplitted.map((_, index) => {
      const start = index * itemsPerRow.value;
      return props.artists.slice(start, start + itemsPerRow.value);
    });
  });

  const { totalSize, virtualRows } = useVirtual(
    computed(() => ({
      items: albums.value,
      estimateSize: () => remToPx(6),
      scrollRef: mainEl,
      listRef,
    })),
  );
</script>

<template>
  <ul :style="{ height: totalSize }" ref="listRef">
    <template v-for="virtualRow in virtualRows" :key="virtualRow.index">
      <li
        v-for="(artist, index) of virtualRow.item"
        :style="{
          inlineSize: `${itemWidth}px`,
          blockSize: `${virtualRow.size}px`,
          transform: `translate(${index * itemWidth}px, ${virtualRow.start}px)`,
        }"
      >
        <RouterLink :to="`/artist/${artist.name}`">
          <CoverImage :src="artist.images?.small" class="cover" />
          <span class="name">{{ artist.name }}</span>
        </RouterLink>
      </li>
    </template>
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
    padding: 0.25rem;
  }

  a {
    display: grid;
    gap: 0.5rem;
    transition: background-color 0.1s ease;
  }

  a:hover {
    background-color: black;
  }

  .cover {
    margin-block-start: 0.25rem;
    margin-inline-start: 0.25rem;
    inline-size: 3rem;
    block-size: 3rem;
    object-fit: cover;
  }

  .name {
    padding: 0.125rem 0.25rem;
    background-color: black;
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
  }
</style>
