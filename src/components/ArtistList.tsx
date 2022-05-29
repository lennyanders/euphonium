import { RouterLink } from '../router';
import { CoverImage } from './CoverImage';

export const ArtistList = ({ artists }: { artists: FEArtist[] }) => (
  <ul class='grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-8'>
    {artists.map((artist) => (
      <li>
        <RouterLink
          href={`/artist/${artist.name}`}
          class='flex flex-col gap-2 content-center h-100%'
        >
          <CoverImage
            src={artist.image}
            class='w-100% rd-50%'
            fallbackCss='mask-size-150% mask-position-center'
          />
          <div class='m-y-auto text-center'>{artist.name}</div>
        </RouterLink>
      </li>
    ))}
  </ul>
);
