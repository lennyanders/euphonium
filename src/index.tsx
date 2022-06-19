/* @refresh reload */
import './base.css';
import 'uno.css';

import { render } from 'voby';
import { App } from './App';
import { Router } from './router';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { NoSupport } from './pages/NoSupport';
import { fileSystemApiSupport, offscreenCanvasSupport, workerSupport } from './consts';

if (!workerSupport || !fileSystemApiSupport || !offscreenCanvasSupport) {
  render(
    <div class='m-a m-t-20 w-100% max-w-2xl flex flex-col gap-4'>
      <Router
        routes={[
          { path: '/about', component: About },
          { path: '/privacy', component: Privacy },
          { path: '*', component: NoSupport },
        ]}
      />
    </div>,
    document.body,
  );
  throw Error('App not supported');
}

render(App, document.body);
