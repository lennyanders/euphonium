import { If } from 'voby';

import { state } from '../../modules/library';

export const Toasts = ({ css }: { css?: JSX.Class }) => (
  <If when={() => state.importing?.message}>
    <div class={['flex items-center gap-2 p-2-4-2-2 rd-2 bg-dark-900 color-amber-1', css]}>
      <div class='i-mdi-autorenew animation-duration-1.5s animate-spin' />
      {() => state.importing?.message}
    </div>
  </If>
);
