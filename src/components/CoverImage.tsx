import { FunctionMaybe, If } from 'voby';

export const CoverImage = ({
  src,
  fallbackCss,
  ...props
}: Omit<JSX.ImgHTMLAttributes<HTMLDivElement>, 'src'> & {
  fallbackCss?: string;
  src?: FunctionMaybe<string>;
}) => (
  <If
    when={src}
    fallback={
      <div {...props}>
        <div class={['aspect-1 w-100% h-100% color-[#111] i-mdi-disk', fallbackCss]} />
      </div>
    }
  >
    <img width='1' height='1' decoding='async' src={src} {...props} />
  </If>
);
