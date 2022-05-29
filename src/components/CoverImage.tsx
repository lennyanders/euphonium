export const CoverImage = ({
  src,
  fallbackCss,
  ...props
}: JSX.ImgHTMLAttributes<HTMLElement> & { fallbackCss?: string }) => {
  return src ? (
    <img width='1' height='1' decoding='async' src={src} {...props} />
  ) : (
    <div {...props}>
      <div class={['aspect-1 w-100% h-100% color-[#111] i-mdi-disk', fallbackCss]} />
    </div>
  );
};
