import { currentTime$, currentTrack$, seek } from '../../modules/player';

export const ProgressBar = ({ bg = 'bg-[#222]' }: { bg?: string }) => (
  <div
    class='relative flex-1 h-2 hover:var-thumb-size-1.5 color-red'
    style={{ '--pos': () => `${(currentTime$() / currentTrack$()?.duration! - 1) * 100}%` }}
  >
    <div
      class={[
        'overflow-hidden relative h-2 rd-1 before:(content-none absolute top-0 right-1 bottom-0 left-1 translate-x-[var(--pos)] bg-current shadow-[-1rem_0_0_currentColor])',
        bg,
      ]}
    />
    <div class='absolute top-0 right-1 bottom-0 left-1 translate-x-[var(--pos)] pointer-events-none before:(content-none pointer-events-auto block absolute h-2 w-2 rd-1 right--1 bg-current transition-transform scale-[var(--thumb-size,1)])' />
    <input
      class='absolute top-0 right-0 bottom-0 left-0 m-0 op-0 cursor-pointer'
      type='range'
      min='0'
      step='0.01'
      max={() => currentTrack$()?.duration!}
      onInput={(event) => seek((event.target as any).value)}
    />
  </div>
);
