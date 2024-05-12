<script setup lang="ts">
  import { Transition } from 'vue';
  import { RouterView } from 'vue-router';

  import Navigation from './components/Navigation.vue';
  import { mainEl } from './modules/layout';
  import { state } from './modules/library';
</script>
″
<template>
  <Navigation />
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

  main {
    padding: 1rem;
    overflow-y: scroll;
    display: grid;
    align-content: start;
    gap: 0.5rem;
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
    grid-auto-columns: minmax(15rem, auto) 1fr;
    height: 100vh;
  }
</style>
