<script setup lang="ts">
  import TrackList from '../components/TrackList.vue';
  import { tracksSortedByTitle } from '../modules/library';
</script>

<template>
  <h1>Tracks</h1>
  <TrackList :tracks="tracksSortedByTitle" />
</template>
