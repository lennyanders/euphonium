import { $$, ObservableMaybe, useComputed } from 'voby';
import { mainElWidth$ } from '../modules/layout';
import { state } from '../modules/library';
import { RouterLink } from '../router';
import { CoverImage } from './CoverImage';
import { VirtualGrid } from './Virtual/Grid';

export const ArtistList = ({ artistIds }: { artistIds: ObservableMaybe<string[]> }) => {
  const artists$ = useComputed(() => $$(artistIds).map((id) => state.artistData[id]));
  return (
    <VirtualGrid
      items={artists$}
      overscan={5}
      parentWidth={mainElWidth$}
      selfWidthDifference={32}
      itemMinWidth={150}
      size={(width) => width + 16 + 24}
      ulClass='m--4'
      liClass='p-4'
    >
      {(artist) => (
        <RouterLink
          href={() => `/artist/${encodeURIComponent(artist().name)}`}
          class='block truncate text-center'
        >
          <CoverImage src={() => artist().image!} css='w-100% rd-50% m-b-4 background-size-125%' />
          {() => artist().name}
        </RouterLink>
      )}
    </VirtualGrid>
  );
};
