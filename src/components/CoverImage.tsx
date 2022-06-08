import { FunctionMaybe, If } from 'voby';

interface Props {
  css?: FunctionMaybe<string>;
  src?: FunctionMaybe<string>;
}

export const CoverImage = ({ src, css }: Props) => (
  <If when={src} fallback={<div class={['i-mdi-disk?bg', css]} />}>
    <img width='1' height='1' decoding='async' src={src} class={['i-mdi-disk?bg w-100%', css]} />
  </If>
);
