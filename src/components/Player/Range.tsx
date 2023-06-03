import { $$, ObservableMaybe } from 'voby';

interface Props {
  max: ObservableMaybe<number>;
  val: () => number;
  seek: (newVal: number) => void;
  bg?: string;
  class?: JSX.Class;
}
export const Range = ({ max, val, seek, bg = 'bg-dark-400', class: css = 'flex-1' }: Props) => (
  <div
    class={[
      'relative h-2 hover:var-thumb-size-1.5 focus-within:var-thumb-size-1.5 color-amber-300',
      css,
    ]}
    style={{ '--pos': () => `${(val() / ($$(max) || 1) - 1) * 100}%` }}
  >
    <div
      class={[
        'overflow-hidden relative h-2 rd-1 before:(content-empty absolute top-0 right-1 bottom-0 left-1 translate-x-[var(--pos)] bg-current shadow-[-1rem_0_0_currentColor])',
        bg,
      ]}
    />
    <div class='absolute top-0 right-1 bottom-0 left-1 translate-x-[var(--pos)] pointer-events-none before:(content-empty pointer-events-auto block absolute h-2 w-2 rd-1 right--1 bg-current transition-transform scale-[var(--thumb-size,1)])' />
    <input
      class='absolute top-0 right-0 bottom-0 left-0 m-0 op-0 cursor-pointer'
      type='range'
      min='0'
      step='0.01'
      max={max}
      onInput={(event) => seek(+(event.target as HTMLInputElement).value)}
    />
  </div>
);
