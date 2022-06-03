import { CoverImage } from '../CoverImage';

export const HeroImageMobilePlayer = (props: {
  image?: string;
  title: JSX.Element;
  sublines?: JSX.Element[];
}) => (
  <div class='relative'>
    <CoverImage src={props.image} class='w-100% rd-2' />
    <div class='absolute left-3 right-3 bottom-3 flex flex-col items-start gap-1'>
      <span class='p-x-1 bg-[#000D] rd-1 max-w-100% truncate'>{props.title}</span>
      {props.sublines?.map((subline) => (
        <small class='p-x-1 flex items-center bg-[#000D] rd-1 max-w-100% truncate'>{subline}</small>
      ))}
    </div>
  </div>
);
