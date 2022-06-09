import { mainElWidth$ } from '../modules/layout';
import { RouterLink } from '../router';
import { CoverImage } from './CoverImage';
import { VirtualGrid } from './Virtual/Grid';

export const AlbumList = ({ albums }: { albums: FEAlbum[] }) => (
  <VirtualGrid
    items={albums}
    overscan={5}
    parentWidth={mainElWidth$}
    selfWidthDifference={16}
    itemMinWidth={140}
    size={(width) => width}
    ulClass='m--2'
    liClass='p-2'
  >
    {(album) => (
      <RouterLink
        class='bg-[#1c1c1c] text-sm relative'
        href={() =>
          `/artist/${encodeURIComponent(album().artist)}/${encodeURIComponent(album().title)}`
        }
      >
        <CoverImage src={() => album().cover!} css='w-100% rd-2' />
        <div class='absolute left-1 right-1 bottom-1 grid gap-1 justify-items-start'>
          <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate'>{() => album().title}</span>
          <small class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate'>{() => album().artist}</small>
        </div>
      </RouterLink>
    )}
  </VirtualGrid>
);
