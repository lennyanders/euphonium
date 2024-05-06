/* @refresh reload */
import './base.css';
import 'uno.css';

import { title } from 'process';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import About from './pages/About.vue';
import Album from './pages/Album.vue';
import AlbumArtists from './pages/AlbumArtists.vue';
import Albums from './pages/Albums.vue';
import Artist from './pages/Artist.vue';
import ArtistTracks from './pages/ArtistTracks.vue';
import Artists from './pages/Artists.vue';
import Settings from './pages/Settings.vue';
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
      path: '/artist/:artist',
      component: Artist,
      meta: { title: () => getTitle(router.currentRoute.value.params.artist as string) },
    },
    {
      path: '/artist/:artist/:album',
      component: Album,
      meta: {
        title: () =>
          getTitle(
            `${router.currentRoute.value.params.album} by ${router.currentRoute.value.params.artist}`,
          ),
      },
    },
    {
      path: '/artist/:artist/tracks',
      component: ArtistTracks,
      meta: { title: () => getTitle(`${router.currentRoute.value.params.artist}'s tracks`) },
    },
    {
      path: '/settings',
      component: Settings,
      meta: { title: getTitle('Settings') },
    },
    {
      path: '/about',
      component: About,
      meta: { title: getTitle('About') },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/tracks',
    },
  ],
});

router.afterEach((route) => {
  if (typeof route.meta.title === 'string') document.title = route.meta.title;
  if (typeof route.meta.title === 'function') document.title = route.meta.title();
});

createApp(App).use(router).mount(document.body);
