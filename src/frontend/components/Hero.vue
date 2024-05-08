<script setup lang="ts">
  import CoverImage from '../components/CoverImage.vue';

  const props = defineProps<{
    image?: string;
    infos?: { text?: string | number; icon: string }[];
  }>();
</script>

<template>
  <div class="hero">
    <CoverImage class="image" :src="props.image" />
    <div class="info">
      <slot />
      <span v-if="props.infos?.length">
        <template v-for="info of props.infos">
          <template v-if="info.text">
            {{ info.text }}
            <div :class="info.icon" />
          </template>
        </template>
      </span>
    </div>
  </div>
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
