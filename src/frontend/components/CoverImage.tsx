import { If } from 'voby';

export const CoverImage = ({
  src,
  class: css,
  width = 1,
  height = 1,
  decoding = 'async',
  ...props
}: JSX.ImgHTMLAttributes<HTMLImageElement>) => (
  <If when={src} fallback={<div class={['i-mdi-disk?bg', css]} />}>
    <img
      width={width}
      height={height}
      decoding={decoding}
      src={src}
      class={['i-mdi-disk?bg w-100%', css]}
      {...props}
    />
  </If>
);
