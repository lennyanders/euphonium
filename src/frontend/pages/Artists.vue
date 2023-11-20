<script setup lang="ts">
  import ArtistList from '../components/ArtistList.vue';
  import { artistsSortedByName } from '../modules/library';
</script>

<template>
  <h1>Artists</h1>
  <ArtistList :artists="artistsSortedByName" />
</template>
