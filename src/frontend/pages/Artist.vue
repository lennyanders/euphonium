<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  import AlbumList from '../components/AlbumList.vue';
  import CoverImage from '../components/CoverImage.vue';
  import TrackList from '../components/TrackList.vue';
  import { state } from '../modules/library';

  const { params } = useRoute();

  const artist = computed(() => state.artistData[params.artist as string]);
</script>

<template>
  <template v-if="artist">
    <div class="hero">
      <CoverImage class="image" :src="artist.images?.large" />
      <div class="info">
        <h1>{{ artist.name }}</h1>
        <span>
          {{ artist.tracks.length }}
          <div class="i-mdi-music-note" />
          {{ artist.albums.length }}
          <div class="i-mdi-disk" />
          {{ artist.durationFormatted }}
          <div class="i-mdi-timer-sand" />
        </span>
      </div>
    </div>
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
