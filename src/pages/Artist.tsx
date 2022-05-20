import { params } from '../router';

export const Artist = () => {
  const { artist } = params();
  if (!artist) return;

  return (
    <>
      <h1>{artist}</h1>
    </>
  );
};
