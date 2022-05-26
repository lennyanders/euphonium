import { RouterLink } from '../router';
import { library } from '../stores/library';

export const Artists = () => {
  const { artists } = library();
  return (
    <>
      <h1>Artists</h1>
      {!artists.length ? (
        <p>
          Add directories in the{' '}
          <RouterLink href='/settings' class='underline'>
            settings
          </RouterLink>{' '}
          and start listening to music!
        </p>
      ) : (
        <ul class='grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-8'>
          {artists.map((artist) => (
            <li>
              <RouterLink
                href={`/artist/${artist.name}`}
                class='flex flex-col gap-2 content-center h-100%'
              >
                {artist.image ? (
                  <img class='w-100% rd-50%' width='1' height='1' src={artist.image} />
                ) : (
                  <div class='w-100% h-100% aspect-1 color-[#111] mask-size-150% mask-position-center i-mdi-disk'></div>
                )}
                <div class='m-y-auto text-center'>{artist.name}</div>
              </RouterLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
