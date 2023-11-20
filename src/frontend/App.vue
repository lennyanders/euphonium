<script setup lang="ts">
  import { Transition } from 'vue';
  import { RouterView } from 'vue-router';

  import Navigation from './components/Navigation.vue';
  import { w1024, mainEl } from './modules/layout';
  import { state } from './modules/library';
</script>
″
<template>
  <Navigation v-if="w1024" />
  <main ref="mainEl">
    <RouterView />
  </main>
  <Transition name="loading">
    <div v-if="state.loading" class="loading">
      <div class="i-mdi-loading" />
      loading
    </div>
  </Transition>
</template>

<style scoped>
  .loading {
    position: fixed;
    inset: 0;
    display: grid;
    gap: 1rem;
    justify-items: center;
    align-content: center;
    background-color: #222;
    transition: opacity 0.1s ease;
  }
  .loading-leave-to {
    opacity: 0;
  }
  .i-mdi-loading {
    font-size: 3rem;
    animation: rotate 0.5s linear infinite;
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
</style>

<style>
  body {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto 1fr;
    overflow-y: scroll;
    padding: 1rem;
    gap: 1rem;
  }
</style>
