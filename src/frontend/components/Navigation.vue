<script setup lang="ts">
  import { RouterLink } from 'vue-router';

  const mainLinks = [
    { href: '/search', icon: 'i-mdi-search', title: 'Search' },
    { href: '/tracks', icon: 'i-mdi-music-note', title: 'Tracks' },
    { href: '/albums', icon: 'i-mdi-disk', title: 'Albums' },
    { href: '/artists', icon: 'i-mdi-account-multiple-outline', title: 'Artists' },
    { href: '/album-artists', icon: 'i-mdi-account-music-outline', title: 'Album Artists' },
    { href: '/settings', icon: 'i-mdi-cog-outline', title: 'Settings' },
  ];
</script>

<template>
  <nav>
    <ul>
      <li v-for="link of mainLinks">
        <RouterLink :to="link.href">
          <div :class="link.icon" />
          {{ link.title }}
        </RouterLink>
      </li>
    </ul>

    <RouterLink to="/about" class="about">
      <div class="i-mdi-information-outline" />
      About
    </RouterLink>
  </nav>
</template>

<style scoped>
  nav {
    padding: 1rem;
    background-color: #111;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  a {
    display: flex;
    gap: 0.5rem;
  }

  ul {
    display: grid;
    gap: 0.5rem;
    font-size: 1.2rem;
  }

  .about {
    color: #ccc;
  }
</style>
