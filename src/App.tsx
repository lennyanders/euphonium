import { If } from 'voby';

import { Transition } from './components/Transition';
import { ContextMenu } from './components/layout/ContextMenu';
import { Footer } from './components/layout/Footer';
import { mainEl$, w1024$ } from './modules/layout';
import { state } from './modules/library';
import { About } from './pages/About';
import { Album } from './pages/Album';
import { AlbumArtists } from './pages/AlbumArtists';
import { Albums } from './pages/Albums';
import { Artist } from './pages/Artist';
import { Artists } from './pages/Artists';
import { Home } from './pages/Home';
import { Player } from './pages/Player';
import { Privacy } from './pages/Privacy';
import { Queue } from './pages/Queue';
import { Search } from './pages/Search';
import { Settings } from './pages/Settings';
import { Tracks } from './pages/Tracks';
import { TracksArtist } from './pages/TracksArtist';
import { Params, Router } from './router';

const baseTitle = 'Euphonium';

const getTitle = (title: string) => `${title} | ${baseTitle}`;

const baseRoutes = [
  { path: '/search', component: Search, title: getTitle('Search') },
  { path: '/tracks', component: Tracks, title: getTitle('Tracks') },
  {
    path: '/tracks/:artistName',
    component: TracksArtist,
    title: (params: Params) => getTitle(`${params.artistName}'s tracks`),
  },
  { path: '/albums', component: Albums, title: getTitle('Albums') },
  { path: '/artists', component: Artists, title: getTitle('Artists') },
  { path: '/album-artists', component: AlbumArtists, title: getTitle('Album artists') },
  {
    path: '/artist/:artistName',
    component: Artist,
    title: (params: Params) => getTitle(params.artistName!),
  },
  {
    path: '/artist/:artist/:albumTitle',
    component: Album,
    title: (params: Params) => getTitle(`${params.albumTitle} by ${params.artist}`),
  },
  { path: '/settings', component: Settings, title: getTitle('Settings') },
  { path: '/about', component: About, title: getTitle('About') },
  { path: '/privacy', component: Privacy, title: getTitle('Privacy') },
];

const mobileRoutes = [
  ...baseRoutes,
  { path: '/player', component: Player, title: getTitle('Player') },
  { path: '*', component: Home, title: baseTitle },
];
const desktopRoutes = [
  ...baseRoutes,
  { path: 'queue', component: Queue, title: getTitle('Queue') },
  { path: '*', redirect: '/tracks' },
];

export const App = () => [
  <If when={() => !state.loading}>
    <If when={w1024$} fallback={() => (mainEl$(document.body), (<Router routes={mobileRoutes} />))}>
      <aside class='h-100vh sticky top-0 flex flex-col gap-4 p-6-6-33-4 overflow-y-auto bg-dark-800'>
        <Home />
      </aside>
      <main class='flex flex-col gap-4 flex-1 p-4 p-b-33' ref={mainEl$}>
        <Router routes={desktopRoutes} />
      </main>
    </If>
    <Footer />
    <ContextMenu />
  </If>,
  <Transition
    when={() => state.loading}
    class='fixed bg-inherit inset-0 grid gap-4 justify-items-center content-center transition-delay-100 transition-opacity'
    leaveToClass='opacity-0'
  >
    <div class='i-mdi-loading w-12 h-12 animate-spin' />
    loading
  </Transition>,
];
