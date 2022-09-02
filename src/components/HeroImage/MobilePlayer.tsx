import { For } from 'voby';

import { HeroImageProps } from '.';
import { CoverImage } from '../CoverImage';

export const HeroImageMobilePlayer = (props: HeroImageProps) => (
  <div class='relative'>
    <CoverImage src={props.image} class='w-100% rd-2' />
    <div class='absolute left-3 right-3 bottom-3 flex flex-col items-start gap-1'>
      <span class='p-x-1 bg-black:90 rd-1 max-w-100% truncate'>{props.title}</span>
      {props.sublines && (
        <For values={props.sublines}>
          {(subline) => (
            <small class='p-x-1 flex items-center bg-black:90 rd-1 max-w-100% truncate'>
              {subline}
            </small>
          )}
        </For>
      )}
    </div>
  </div>
);
