<script setup lang="ts">
  import { computed } from 'vue';
  import { RouterLink, useRoute } from 'vue-router';

  import Hero from '../components/Hero.vue';
  import TrackList from '../components/TrackList.vue';
  import { state } from '../modules/library';

  const { params } = useRoute();

  const album = computed(() => state.albumData[`${params.artist}${params.album}`]);
</script>

<template>
  <template v-if="album">
    <Hero
      :image="album.images?.large"
      :infos="[
        { text: album.year, icon: 'i-mdi-candle' },
        { text: album.tracks.length, icon: 'i-mdi-music-note' },
        { text: album.diskCount, icon: 'i-mdi-disk' },
        { text: album.durationFormatted, icon: 'i-mdi-timer-sand' },
      ]"
    >
      <h1>{{ album.artist }}</h1>
      <RouterLink :to="`/artist/${album.artist}`">{{ album.artist }}</RouterLink>
    </Hero>
    <TrackList
      :tracks="computed(() => album.tracks.map((track) => state.trackData[track]))"
      :show-disk-on-tracks="album.showDiskOnTracks"
      show-number
    />
  </template>
</template>
