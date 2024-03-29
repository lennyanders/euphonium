import { ternary } from 'oby';
import { $, $$, For } from 'voby';

import { HeroImageProps } from '.';
import { CoverImage } from '../CoverImage';

export const HeroImageMobile = (props: HeroImageProps) => {
  const fullImage$ = $(false);
  return (
    <div
      class={[
        'p-t-8 relative m--4 min-w-[calc(100%+2rem)] overflow-hidden transition-margin duration-250 m-b-2',
        () => !$$(fullImage$) && 'm-t-[calc(-30vw-3rem)]',
      ]}
      onClick={() => fullImage$((val) => !val)}
    >
      <CoverImage
        src={props.image}
        class={[
          'w-100% transition-transform duration-250',
          ternary(fullImage$, 'translate-y--8', 'translate-y-15vw'),
        ]}
      />
      <div
        class={[
          'transition-opacity duration-250 absolute left-3 right-3 bottom-3 flex flex-col items-start gap-1',
          { 'opacity-0': fullImage$ },
        ]}
      >
        <span class='p-x-1 bg-black:90 rd-1 max-w-100% truncate'>{props.title}</span>
        <For values={props.sublines || []}>
          {(subline) => (
            <small class='p-x-1 flex items-center bg-black:90 rd-1 max-w-100% truncate'>
              {subline}
            </small>
          )}
        </For>
      </div>
      <div
        class={[
          'i-mdi-chevron-up absolute bottom--3 w-12 h-12 left-50% m-l--6 transition-opacity duration-250',
          () => !$$(fullImage$) && 'opacity-0',
        ]}
      />
    </div>
  );
};
