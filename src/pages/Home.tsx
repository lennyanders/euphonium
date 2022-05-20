import { RouterLink } from '../router';

export const Home = () => {
  return (
    <div class='grid gap-2'>
      <RouterLink href='/tracks'>Tracks</RouterLink>
      <RouterLink href='/albums'>Albums</RouterLink>
      <RouterLink href='/artists'>Artists</RouterLink>
      <RouterLink href='/playlists'>Playlists</RouterLink>
      <RouterLink href='/folders'>Folders</RouterLink>
    </div>
  );
};
