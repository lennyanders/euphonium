import { $$, ObservableMaybe, useComputed } from 'voby';
import { mainElWidth$ } from '../modules/layout';
import { state } from '../modules/library';
import { RouterLink } from '../router';
import { CoverImage } from './CoverImage';
import { VirtualGrid } from './Virtual/Grid';

export const AlbumList = ({ albumIds }: { albumIds: ObservableMaybe<string[]> }) => {
  const albums$ = useComputed(() => $$(albumIds).map((id) => state.albumData[id]));
  return (
    <VirtualGrid
      items={albums$}
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
          class='text-sm relative'
          href={() =>
            `/artist/${encodeURIComponent(album().artist)}/${encodeURIComponent(album().title)}`
          }
        >
          <CoverImage src={() => album().cover!} css='w-100% rd-2 bg-dark-800' />
          <div class='absolute left-1 right-1 bottom-1 grid gap-1 justify-items-start'>
            <span class='p-x-1 bg-black:90 rd-1 max-w-100% truncate'>{() => album().title}</span>
            <small class='p-x-1 bg-black:90 rd-1 max-w-100% truncate'>{() => album().artist}</small>
          </div>
        </RouterLink>
      )}
    </VirtualGrid>
  );
};
