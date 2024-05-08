<script setup lang="ts">
  import { computed } from '@vue/reactivity';
  import { useRoute } from 'vue-router';

  import Hero from '../components/Hero.vue';
  import TrackList from '../components/TrackList.vue';
  import { state } from '../modules/library';

  const { params } = useRoute();

  const artist = computed(() => state.artistData[params.artist as string]);
</script>

<template>
  <template v-if="artist">
    <Hero
      :image="artist.images?.large"
      :infos="[
        { text: artist.tracks.length, icon: 'i-mdi-music-note' },
        { text: artist.durationFormatted, icon: 'i-mdi-timer-sand' },
      ]"
    >
      <h1>
        All track from <RouterLink :to="`/artist/${artist.name}`">{{ artist.name }}</RouterLink>
      </h1>
    </Hero>
    <TrackList :tracks="computed(() => artist.tracks.map((track) => state.trackData[track]))" />
  </template>
</template>
