import { $, Ternary } from 'voby';
import { CoverImage } from './CoverImage';

export const HeroImage = ({
  image,
  title,
  sublines,
}: {
  image?: string;
  title: JSX.Element;
  sublines?: JSX.Element[];
}) => {
  const desktopMatcher = matchMedia('(min-width: 640px)');
  const desktop = $(desktopMatcher.matches);
  desktopMatcher.addEventListener('change', ({ matches }) => desktop(matches));
  const fullImage = $(false);

  return (
    <Ternary when={desktop}>
      <div class='flex gap-4'>
        <CoverImage src={image} class='w-25% rd-2' />
        <div class='flex flex-col justify-end items-start gap-1 p-b-4 overflow-hidden'>
          <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate'>{title}</span>
          {sublines?.map((subline) => (
            <small class='p-x-1 flex items-center bg-[#000D] rd-1 max-w-100% truncate'>
              {subline}
            </small>
          ))}
        </div>
      </div>
      {/* mobile */}
      <div
        class={() => [
          'p-t-8 relative m--4 min-w-[calc(100%+2rem)] overflow-hidden transition-margin duration-250 m-b-2',
          !fullImage() && 'm-t-[calc(-30vw-3rem)]',
        ]}
        onClick={() => fullImage((val) => !val)}
      >
        <CoverImage
          src={image}
          class={() => [
            'w-100% transition-transform duration-250',
            fullImage() ? 'translate-y--8' : 'translate-y-15vw',
          ]}
        />
        <div
          class={() => [
            'transition-opacity duration-250 absolute left-3 right-3 bottom-3 flex flex-col items-start gap-1',
            fullImage() && 'opacity-0',
          ]}
        >
          <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate'>{title}</span>
          {sublines?.map((subline) => (
            <small class='p-x-1 flex items-center bg-[#000D] rd-1 max-w-100% truncate'>
              {subline}
            </small>
          ))}
        </div>
        <div
          class={() => [
            'i-mdi-chevron-up absolute bottom--3 w-12 h-12 left-50% m-l--6 transition-opacity duration-250',
            !fullImage() && 'opacity-0',
          ]}
        />
      </div>
    </Ternary>
  );
};
