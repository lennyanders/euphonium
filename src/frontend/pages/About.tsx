import { version } from '../../../package.json';

export const About = () => [
  <h1>About</h1>,
  <img src='/icon.svg' width='1' height='1' class='w-24' />,
  <span>Current version {version}</span>,
  <p>Euphonium is an open source in browser music player for your local music files</p>,
  <ul class='grid gap-2'>
    <li>
      <a href='https://github.com/lennyanders/euphonium' class='flex items-center gap-2'>
        <div class='i-mdi-github' />
        Source Code
      </a>
    </li>
  </ul>,
  <h2>Acknowledgements</h2>,
  <ul class='grid gap-2'>
    <li>
      <a href='https://snaeplayer.com/about'>
        <span class='flex items-center gap-2'>
          <div>
            <div class='i-mdi-link' />
          </div>
          Snae Player
        </span>
        <small class='block p-l-6'>
          A huge inspiration and project that made me realize what is possible
        </small>
      </a>
    </li>
    <li>
      <a href='https://powerampapp.com/'>
        <span class='flex items-center gap-2'>
          <div>
            <div class='i-mdi-link' />
          </div>
          PowerAmp
        </span>
        <small class='block p-l-6'>
          The best music player for android and sadly only android, so that I wrote this for all the
          other Systems
        </small>
      </a>
    </li>
  </ul>,
];
