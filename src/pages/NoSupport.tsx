import { RouterLink } from '../router';

export const NoSupport = () => (
  <>
    This app is not supported in your browser, please use a browser that supports the following
    features:
    <ul class='grid gap-2'>
      <li>
        <a class='flex items-center gap-2' href='https://caniuse.com/webworkers'>
          <div class='i-mdi-link' />
          Web Workers
        </a>
      </li>
      <li>
        <a class='flex items-center gap-2' href='https://caniuse.com/native-filesystem-api'>
          <div class='i-mdi-link' />
          File System Access API
        </a>
      </li>
      <li>
        <a class='flex items-center gap-2' href='https://caniuse.com/offscreencanvas'>
          <div class='i-mdi-link' />
          OffscreenCanvas
        </a>
      </li>
    </ul>
    <ul class='flex gap-8 m-t-a p-t-12 text-sm op-75'>
      <li>
        <RouterLink class='flex items-center gap-2' href='/about'>
          <div class='i-mdi-information-outline' />
          About
        </RouterLink>
      </li>
      <li>
        <RouterLink class='flex items-center gap-2' href='/privacy'>
          <div class='i-mdi-shield-half-full' />
          Privacy Policy
        </RouterLink>
      </li>
    </ul>
  </>
);
