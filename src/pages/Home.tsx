import { RouterLink } from '../router';

export const Home = () => {
  return (
    <>
      <RouterLink href='/tracks'>Tracks</RouterLink>
      <RouterLink href='/albums'>Albums</RouterLink>
      <RouterLink href='/artists'>Artists</RouterLink>
      <RouterLink href='/playlists'>Playlists</RouterLink>
      <RouterLink href='/folders'>Folders</RouterLink>
    </>
  );
};
