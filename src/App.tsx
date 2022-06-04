import { If } from 'voby';
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
import { loading$ } from './modules/library';
import { w1024$ } from './modules/layout';

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
  <If
    when={loading$}
    fallback={
      <>
        <If when={w1024$} fallback={<Router routes={mobileRoutes} />}>
          <div class='h-100vh sticky top-0 flex flex-col gap-4 p-4 p-b-33 overflow-y-auto'>
            <Home />
          </div>
          <div class='flex flex-col gap-4 flex-1 p-4 p-b-33'>
            <Router routes={desktopRoutes} />
          </div>
        </If>
        <Footer />
      </>
    }
  >
    <div class='fixed flex bg-inherit top-0 right-0 bottom-0 left-0'>
      <div class='m-a flex flex-col items-center'>
        <div class='i-mdi-loading w-12 h-12 animate-spin'></div>
        <span class='m-t-4'>loading</span>
      </div>
    </div>
  </If>
);
