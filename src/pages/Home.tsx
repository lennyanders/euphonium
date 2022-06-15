import { RouterLink } from '../router';

export const Home = () => (
  <>
    <ul class='grid gap-2'>
      <li>
        <RouterLink class='flex items-center gap-2' href='/tracks'>
          <div class='i-mdi-music-note' />
          Tracks
        </RouterLink>
      </li>
      <li>
        <RouterLink class='flex items-center gap-2' href='/albums'>
          <div class='i-mdi-disk' />
          Albums
        </RouterLink>
      </li>
      <li>
        <RouterLink class='flex items-center gap-2' href='/artists'>
          <div class='i-mdi-account-multiple-outline' />
          Artists
        </RouterLink>
      </li>
      <li>
        <RouterLink class='flex items-center gap-2' href='/album-artists'>
          <div class='i-mdi-account-music-outline' />
          Album Artists
        </RouterLink>
      </li>
      {/* <RouterLink class='flex items-center gap-2' href='/playlists'>Playlists</RouterLink> */}
      {/* <RouterLink class='flex items-center gap-2' href='/folders'>Folders</RouterLink> */}
      <li>
        <RouterLink class='flex items-center gap-2' href='/settings'>
          <div class='i-mdi-cog-outline' />
          Settings
        </RouterLink>
      </li>
    </ul>
    <ul class='grid gap-2 m-t-a p-t-12 text-sm op-75'>
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
