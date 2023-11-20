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

const getTitle = (title: string) => `${title} | ${document.title}`;

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/tracks',
      component: Tracks,
      meta: { title: getTitle('Tracks') },
    },
    {
      path: '/albums',
      component: Albums,
      meta: { title: getTitle('Albums') },
    },
    {
      path: '/artists',
      component: Artists,
      meta: { title: getTitle('Artists') },
    },
    {
      path: '/album-artists',
      component: AlbumArtists,
      meta: { title: getTitle('Album artists') },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/tracks',
    },
  ],
});

router.afterEach((route) => {
  if (typeof route.meta.title === 'string') document.title = route.meta.title;
});

createApp(App).use(router).mount(document.body);
