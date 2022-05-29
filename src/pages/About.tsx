import { version } from '../../package.json';
import { RouterLink } from '../router';

export const About = () => (
  <>
    <h1>About</h1>
    <img src='/icon.svg' width='1' height='1' class='w-24' />
    <span>Current version {version}</span>
    <p>Euphonium is an open source in browser music player for you'r local music files</p>
    <ul class='grid gap-2'>
      <li>
        <a href='https://github.com/lennyanders/euphonium' class='flex items-center gap-2'>
          <div class='i-mdi-github' />
          Source Code
        </a>
      </li>
      <li>
        <RouterLink href='/privacy' class='flex items-center gap-2'>
          <div class='i-mdi-file-document-outline' />
          Privacy Policy
        </RouterLink>
      </li>
    </ul>
  </>
);
