import { For } from 'voby';
import { HeroImageProps } from '.';
import { CoverImage } from '../CoverImage';

export const HeroImageDesktop = (props: HeroImageProps) => (
  <div class='flex gap-4'>
    <CoverImage src={props.image} css='w-25% rd-2' />
    <div class='flex flex-col justify-end items-start gap-1 p-b-4 overflow-hidden'>
      <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate'>{props.title}</span>
      {props.sublines && (
        <For values={props.sublines}>
          {(subline) => (
            <small class='p-x-1 flex items-center bg-[#000D] rd-1 max-w-100% truncate'>
              {subline}
            </small>
          )}
        </For>
      )}
    </div>
  </div>
);
