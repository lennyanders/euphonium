/* @refresh reload */
import './base.css';
import 'uno.css';

import { render } from 'voby';
import { App } from './App';

if (!window.OffscreenCanvas || !window.showDirectoryPicker || !window.Worker) {
  render(
    <div class='m-a m-t-20'>
      This app is not supported in your browser, please use a browser that supports the following
      features:
      <ul class='grid gap-2 m-t-4'>
        <li class='flex items-center gap-2'>
          <div class='i-mdi-link' />
          <a href='https://caniuse.com/webworkers'>Web Workers</a>
        </li>
        <li class='flex items-center gap-2'>
          <div class='i-mdi-link' />
          <a href='https://caniuse.com/native-filesystem-api'>File System Access API</a>
        </li>
        <li class='flex items-center gap-2'>
          <div class='i-mdi-link' />
          <a href='https://caniuse.com/offscreencanvas'>OffscreenCanvas</a>
        </li>
      </ul>
    </div>,
    document.body,
  );
  throw Error('App not supported');
}

render(App, document.body);
