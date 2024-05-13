<script setup lang="ts">
  import { Transition } from 'vue';
  import { RouterView } from 'vue-router';

  import Navigation from './components/Navigation.vue';
  import Player from './components/Player.vue';
  import { mainEl } from './modules/layout';
  import { state } from './modules/library';
</script>
″
<template>
  <Navigation />
  <Player />
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
    grid-area: main;
    padding: 1rem;
    overflow-y: scroll;
    background-color: #111;
    display: grid;
    align-content: start;
    gap: 0.5rem;
  }

  main::-webkit-scrollbar {
    width: 0.375rem;
  }

  main::-webkit-scrollbar-track {
    background-color: transparent;
  }

  main::-webkit-scrollbar-thumb {
    background-color: #444;
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
</style>

<style>
  body {
    height: 100vh;
    padding: 0.5rem;
    background-color: black;
    display: grid;
    gap: 0.5rem;
    grid-template: 'nav main' 1fr 'player main' auto / 15rem 1fr;
  }
</style>
