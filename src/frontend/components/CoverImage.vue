<script setup lang="ts">
  const props = defineProps<{ src?: string }>();
</script>

<template>
  <img
    v-if="props.src"
    width="1"
    height="1"
    :src="src"
    alt=""
    decoding="async"
    class="i-mdi-disk?bg"
  />
  <div v-else class="i-mdi-disk?bg"></div>
</template>
