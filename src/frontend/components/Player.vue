<script setup lang="ts">
  import { computed } from 'vue';

  import { state } from '../modules/library';
  import { currentTrack, go, isFirst, isLast, pause, play, shuffle } from '../modules/player';
  import { postMessage } from '../utils/worker';
  import CoverImage from './CoverImage.vue';

  const loopIcon = computed(() => {
    if (state.loop === 'track') return 'i-mdi-repeat-once';
    if (state.loop === 'queue') return 'i-mdi-repeat';
    return 'i-mdi-repeat-off op-50';
  });

  const getNextLoopMode = (): typeof state.loop => {
    if (state.loop === 'track') return 'none';
    if (state.loop === 'queue') return 'track';
    return 'queue';
  };

  const isLoop = computed(() => !!state.loop && state.loop !== 'none');
</script>

<template>
  <div class="bg" v-if="currentTrack">
    <CoverImage class="cover" :src="currentTrack.images?.large" />
    {{ currentTrack.title }}
    <small>
      <RouterLink :to="`/artist/${currentTrack.artist}`">{{ currentTrack.artist }}</RouterLink>
    </small>
    <div class="controls">
      <button
        @click="postMessage({ message: 'setGeneralData', state: { loop: getNextLoopMode() } })"
        :class="loopIcon"
      />
      <button @click="go(-1)" class="i-mdi-skip-previous-outline" :disabled="!isLoop && isFirst" />
      <button
        @click="state.playing ? pause() : play()"
        :class="state.playing ? 'i-mdi-pause' : 'i-mdi-play'"
      />
      <button @click="go(1)" class="i-mdi-skip-next-outline" :disabled="!isLoop && isLast" />
      <button
        @click="shuffle(!state.shuffle)"
        :class="['i-mdi-shuffle', !state.shuffle && 'op-50']"
      />
    </div>
  </div>
</template>

<style scoped>
  .op-50,
  button:disabled {
    opacity: 0.5;
  }

  .bg {
    padding: 0.5rem;
    background-color: #111;
    display: grid;
    gap: 0.5rem;
  }

  .cover {
    width: 100%;
  }

  .controls {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .controls button {
    width: 1.5rem;
  }
</style>
