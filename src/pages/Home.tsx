import { RouterLink } from '../router';

export const Home = () => {
  return (
    <>
      <ul class='grid gap-2'>
        <li>
          <RouterLink href='/tracks'>Tracks</RouterLink>
        </li>
        <li>
          <RouterLink href='/albums'>Albums</RouterLink>
        </li>
        <li>
          <RouterLink href='/artists'>Artists</RouterLink>
        </li>
        <li>
          <RouterLink href='/album-artists'>Album Artists</RouterLink>
        </li>
        {/* <RouterLink href='/playlists'>Playlists</RouterLink> */}
        {/* <RouterLink href='/folders'>Folders</RouterLink> */}
        <li>
          <RouterLink href='/settings'>Settings</RouterLink>
        </li>
      </ul>
      <ul class='grid gap-2 m-t-a p-t-12 text-sm op-75'>
        <li>
          <RouterLink href='/about'>About</RouterLink>
        </li>
        <li>
          <RouterLink href='/privacy'>Privacy Policy</RouterLink>
        </li>
      </ul>
    </>
  );
};
