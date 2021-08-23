import { Link } from 'preact-router';
import {
  mdiAccountMusic,
  mdiAlbum,
  mdiCog,
  mdiFolderMusic,
  mdiMusicNote,
  mdiPlaylistMusic,
} from '@mdi/js';
import { Icon } from '../icon';
import { nav, link } from './index.css';

const Entry = ({ href, path, text }: { href: string; path: string; text: string }) => (
  <Link href={href} class={link}>
    <Icon path={path} />
    {text}
  </Link>
);

export const Navigation = () => (
  <nav class={nav}>
    <Entry href='/artists' path={mdiAccountMusic} text='Artists' />
    <Entry href='/albums' path={mdiAlbum} text='Albums' />
    <Entry href='/songs' path={mdiMusicNote} text='Songs' />
    <Entry href='/playlists' path={mdiPlaylistMusic} text='Playlists' />
    <Entry href='/folders' path={mdiFolderMusic} text='Folders' />
    <Entry href='/settings' path={mdiCog} text='Settings' />
  </nav>
);
