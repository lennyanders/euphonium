/* @refresh reload */
import './base.css';
import 'uno.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import AlbumArtists from './pages/AlbumArtists.vue';
import Albums from './pages/Albums.vue';
import Artists from './pages/Artists.vue';
import Tracks from './pages/Tracks.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/tracks',
      component: Tracks,
    },
    {
      path: '/albums',
      component: Albums,
    },
    {
      path: '/artists',
      component: Artists,
    },
    {
      path: '/album-artists',
      component: AlbumArtists,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/tracks',
    },
  ],
});

createApp(App).use(router).mount(document.body);
