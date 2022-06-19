import { $, If } from 'voby';
import { Footer } from './components/layout/Footer';
import { About } from './pages/About';
import { Album } from './pages/Album';
import { AlbumArtists } from './pages/AlbumArtists';
import { Albums } from './pages/Albums';
import { Artist } from './pages/Artist';
import { Artists } from './pages/Artists';
import { Home } from './pages/Home';
import { Player } from './pages/Player';
import { Privacy } from './pages/Privacy';
import { Settings } from './pages/Settings';
import { Tracks } from './pages/Tracks';
import { Queue } from './pages/Queue';
import { Router } from './router';
import { state } from './modules/library';
import { mainEl$, w1024$ } from './modules/layout';

const baseRoutes = [
  { path: '/tracks', component: Tracks },
  { path: '/albums', component: Albums },
  { path: '/artists', component: Artists },
  { path: '/album-artists', component: AlbumArtists },
  { path: '/artist/:artistName', component: Artist },
  { path: '/artist/:artist/:albumTitle', component: Album },
  { path: '/settings', component: Settings },
  { path: '/about', component: About },
  { path: '/privacy', component: Privacy },
];

const mobileRoutes = [
  ...baseRoutes,
  { path: '/player', component: Player },
  { path: '*', component: Home },
];
const desktopRoutes = [
  ...baseRoutes,
  { path: 'queue', component: Queue },
  { path: '*', redirect: '/tracks' },
];

export const App = () => {
  const showLoadingSpinner$ = $(true);
  return (
    <>
      <If when={() => !state.loading}>
        <If
          when={w1024$}
          fallback={() => (mainEl$(document.body), (<Router routes={mobileRoutes} />))}
        >
          <aside class='h-100vh sticky top-0 flex flex-col gap-4 p-4 p-b-33 overflow-y-auto bg-dark-800'>
            <Home />
          </aside>
          <main class='flex flex-col gap-4 flex-1 p-4 p-b-33' ref={mainEl$}>
            <Router routes={desktopRoutes} />
          </main>
        </If>
        <Footer />
      </If>
      <If when={showLoadingSpinner$}>
        <div
          class={[
            'fixed bg-inherit inset-0 grid gap-4 justify-items-center content-center transition-delay-100 transition-opacity',
            () => !state.loading && 'opacity-0',
          ]}
          onTransitionEnd={() => showLoadingSpinner$(false)}
        >
          <div class='i-mdi-loading w-12 h-12 animate-spin' />
          loading
        </div>
      </If>
    </>
  );
};
