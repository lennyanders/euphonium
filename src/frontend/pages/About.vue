<script setup lang="ts">
  import { version } from '../../../package.json';
</script>

<template>
  <h1>About</h1>
  <img src="/icon.svg" width="1" height="1" />
  <span>Current version {{ version }}</span>
  <p>Euphonium is an open source in browser music player for your local music files</p>
  <ul>
    <li>
      <a href="https://github.com/lennyanders/euphonium" class="title">
        <div class="i-mdi-github" />
        Source Code
      </a>
    </li>
  </ul>
  <h2>Acknowledgements</h2>
  <ul>
    <li>
      <a href="https://snaeplayer.com/about">
        <span class="title">
          <div>
            <div class="i-mdi-link" />
          </div>
          Snae Player
        </span>
        <small> A huge inspiration and project that made me realize what is possible </small>
      </a>
    </li>
    <li>
      <a href="https://powerampapp.com/">
        <span class="title">
          <div>
            <div class="i-mdi-link" />
          </div>
          PowerAmp
        </span>
        <small>
          The best music player for android and sadly only android, so that I wrote this for all the
          other Systems
        </small>
      </a>
    </li>
  </ul>
</template>

<style scoped>
  img {
    width: 6rem;
  }

  ul {
    display: grid;
    gap: 0.5rem;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  small {
    display: block;
    padding-left: 1.5rem;
  }
</style>
