import { If, Ternary } from 'voby';
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
import { Router } from './router';
import { state } from './modules/library';
import { mainEl$, w1024$ } from './modules/layout';

const baseRoutes = [
  { path: '/player', component: Player },
  { path: '/tracks', component: Tracks },
  { path: '/albums', component: Albums },
  { path: '/artists', component: Artists },
  { path: '/album-artists', component: AlbumArtists },
  { path: '/artist/:artistName', component: Artist },
  { path: '/artist/:artist/:albumTitle', component: Album },
  { path: '/settings', component: Settings },
  { path: '/about', component: About },
  { path: '/privacy', component: Privacy },
  { path: '*', component: '404' },
];

const mobileRoutes = [{ path: '/', component: Home }, ...baseRoutes];
const desktopRoutes = [{ path: '/', component: Tracks }, ...baseRoutes];

export const App = () => (
  <Ternary when={state.loading}>
    <div class='fixed inset-0 grid gap-4 justify-items-center content-center'>
      <div class='i-mdi-loading w-12 h-12 animate-spin'></div>
      loading
    </div>
    {/* loaded */}
    <>
      <If
        when={w1024$}
        fallback={() => (mainEl$(document.body), (<Router routes={mobileRoutes} />))}
      >
        <aside class='h-100vh sticky top-0 flex flex-col gap-4 p-4 p-b-33 overflow-y-auto bg-[#191919]'>
          <Home />
        </aside>
        <main class='flex flex-col gap-4 flex-1 p-4 p-b-33' ref={mainEl$}>
          <Router routes={desktopRoutes} />
        </main>
      </If>
      <Footer />
    </>
  </Ternary>
);
