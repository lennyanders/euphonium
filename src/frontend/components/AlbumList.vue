<script setup lang="ts">
  import { computed } from 'vue';
  import { RouterLink } from 'vue-router';

  import { mainElWidth } from '../modules/layout';
  import { remToPx } from '../utils/rem-to-px';
  import CoverImage from './CoverImage.vue';
  import { useVirtual } from './Virtual';

  const props = defineProps<{ albums: FeAlbum[] }>();

  const ulWidth = computed(() => mainElWidth.value + remToPx(0.5));
  const itemsPerRow = computed(() => Math.floor(ulWidth.value / remToPx(8.5)));
  const itemWidth = computed(() => ulWidth.value / itemsPerRow.value);

  const albums = computed(() => {
    if (!props.albums.length) return [];
    const emptyAlbumsSplitted = Array.from({
      length: Math.ceil(props.albums.length / itemsPerRow.value),
    });
    return emptyAlbumsSplitted.map((_, index) => {
      const start = index * itemsPerRow.value;
      return props.albums.slice(start, start + itemsPerRow.value);
    });
  });

  const { totalSize, virtualRows } = useVirtual(
    computed(() => ({ items: albums.value, estimateSize: () => itemWidth.value })),
  );
</script>

<template>
  <ul :style="{ height: totalSize }">
    <template v-for="virtualRow in virtualRows" :key="virtualRow.index">
      <li
        v-for="(album, index) of virtualRow.item"
        :style="{
          inlineSize: `${itemWidth}px`,
          blockSize: `${virtualRow.size}px`,
          transform: `translate(${index * itemWidth}px, ${virtualRow.start}px)`,
        }"
      >
        <RouterLink :to="`/artist/${album.artist}/${album.title}`">
          <CoverImage :src="album.images?.medium" class="cover" />
          <span class="info">
            <span class="title">{{ album.title }}</span>
            <small>- {{ album.artist }}</small>
          </span>
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
    position: relative;
  }

  .cover {
    block-size: 100%;
    inline-size: 100%;
    object-fit: cover;
    z-index: -1;
  }

  .info {
    position: absolute;
    inset: auto -0.125rem -0.125rem -0.125rem;
    padding: 0.25rem 0.375rem;
    font-size: 0.875rem;
    background-color: black;
    opacity: 0;
    transition: opacity 0.1s ease;
  }

  .title {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  small {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  a:hover .info {
    opacity: 1;
  }
</style>
