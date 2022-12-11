import { state } from '../../modules/library';
import { Transition } from '../Transition';

export const Toasts = ({ class: css }: { class?: JSX.Class }) => (
  <Transition
    when={() => state.importing}
    class={[
      'flex items-center gap-2 p-2-4-2-2 rd-2 bg-dark-900 color-amber-1 transition-opacity transition-duration-250',
      css,
    ]}
    enterFromClass='opacity-0'
    leaveToClass='opacity-0'
  >
    <div class='i-mdi-autorenew animation-duration-1.5s animate-spin' />
    importing
  </Transition>
);
