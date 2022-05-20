import { Footer } from './components/layout/Footer';
import { Albums } from './pages/Albums';
import { Artist } from './pages/Artist';
import { Artists } from './pages/Artists';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { Tracks } from './pages/Tracks';
import { Router } from './router';

export const App = () => {
  return (
    <>
      <Router
        routes={[
          { path: '/', component: Home },
          { path: '/tracks', component: Tracks },
          { path: '/albums', component: Albums },
          { path: '/artists', component: Artists },
          { path: '/artist/:artist', component: Artist },
          { path: '/settings', component: Settings },
          { path: '*', component: '404' },
        ]}
      />
      <Footer />
    </>
  );
};
