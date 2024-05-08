<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  import AlbumList from '../components/AlbumList.vue';
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
        { text: artist.albums.length, icon: 'i-mdi-disk' },
        { text: artist.durationFormatted, icon: 'i-mdi-timer-sand' },
      ]"
    >
      <h1>{{ artist.name }}</h1>
    </Hero>
    <template v-if="artist.albums.length">
      <RouterLink :to="`/artist/${artist.name}/tracks`" class="all-songs-link">
        <div class="i-mdi-music-circle" />
        <span>All tracks</span>
        <small>{{ artist.tracks.length }}</small>
      </RouterLink>
      <h2>Albums ({{ artist.albums.length }})</h2>
      <AlbumList :albums="computed(() => artist.albums.map((album) => state.albumData[album]))" />
    </template>
    <template v-if="artist.singles.length">
      <h2>Singles ({{ artist.singles.length }})</h2>
      <TrackList :tracks="computed(() => artist.singles.map((track) => state.trackData[track]))" />
    </template>
  </template>
</template>

<style scoped>
  .all-songs-link {
    display: grid;
    align-items: center;
    column-gap: 0.5rem;
    grid-template: 'image title' auto 'image subtitle' auto / auto 1fr;

    small {
      grid-area: subtitle;
    }

    .i-mdi-music-circle {
      grid-area: image;
      width: 2rem;
    }
  }
</style>
