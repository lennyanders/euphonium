<script setup lang="ts">
  import { computed } from 'vue';

  import ArtistList from '../components/ArtistList.vue';
  import { artistsSortedByName } from '../modules/library';

  const albumArtists = computed(() =>
    artistsSortedByName.value.filter((artist) => artist.albums.length),
  );
</script>

<template>
  <h1>Album Artists</h1>
  <ArtistList :artists="albumArtists" />
</template>
