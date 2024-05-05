<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute, RouterLink } from 'vue-router';

  import CoverImage from '../components/CoverImage.vue';
  import TrackList from '../components/TrackList.vue';
  import { state } from '../modules/library';

  const { params } = useRoute();

  const album = computed(() => state.albumData[`${params.artist}${params.albumTitle}`]);
</script>

<template>
  <template v-if="album">
    <div class="hero">
      <CoverImage class="image" :src="album.images?.large" />
      <div class="info">
        <h1>{{ album.title }}</h1>
        <RouterLink :to="`/artist/${album.artist}`">{{ album.artist }}</RouterLink>
        <span>
          {{ album.year }}
          <div class="i-mdi-candle" />
          {{ album.tracks.length }}
          <div class="i-mdi-music-note" />
          {{ album.diskCount }}
          <div class="i-mdi-disk" />
          {{ album.durationFormatted }}
          <div class="i-mdi-timer-sand" />
        </span>
      </div>
    </div>
    <TrackList
      :tracks="computed(() => album.tracks.map((track) => state.trackData[track]))"
      :show-disk-on-tracks="album.showDiskOnTracks"
      show-number
    />
  </template>
</template>

<style scoped>
  .hero {
    display: grid;
    align-items: end;
    grid-template-columns: 25% 1fr;
    margin-block-end: 2rem;
  }

  .image {
    inline-size: 100%;
  }

  .info {
    padding: 1rem;
    display: grid;
    gap: 0.5rem;
    background-color: black;
  }

  .info span {
    display: flex;
    align-items: center;
  }

  .info span div:not(:last-child) {
    margin-inline-end: 0.5rem;
  }
</style>
