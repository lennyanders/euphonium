<script setup lang="ts">
  import AlbumList from '../components/AlbumList.vue';
  import { albumsSortedByTitle } from '../modules/library';
</script>

<template>
  <h1>Albums</h1>
  <AlbumList :albums="albumsSortedByTitle" />
</template>
