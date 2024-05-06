<script setup lang="ts">
  import { computed } from '@vue/reactivity';
  import { useRoute } from 'vue-router';

  import CoverImage from '../components/CoverImage.vue';
  import TrackList from '../components/TrackList.vue';
  import { state } from '../modules/library';

  const { params } = useRoute();

  const artist = computed(() => state.artistData[params.artist as string]);
</script>

<template v-if="artist">
  <div class="hero">
    <CoverImage class="image" :src="artist.images?.large" />
    <div class="info">
      <h1>
        All track from <RouterLink :to="`/artist/${artist.name}`">{{ artist.name }}</RouterLink>
      </h1>
      <span>
        {{ artist.tracks.length }}
        <div class="i-mdi-music-note" />
        {{ artist.durationFormatted }}
        <div class="i-mdi-timer-sand" />
      </span>
    </div>
  </div>
  <TrackList :tracks="computed(() => artist.tracks.map((track) => state.trackData[track]))" />
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
