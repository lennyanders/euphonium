import { $, If, useMemo } from 'voby';

import { HeroImage } from '../components/HeroImage';
import { HeroImageMobilePlayer } from '../components/HeroImage/MobilePlayer';
import { MainControls } from '../components/Player/MainControls';
import { Progress } from '../components/Player/Progress';
import { Slider, volumeIcon$ } from '../components/Player/Volume';
import { TrackList } from '../components/TrackList';
import { cleanQueue$, state } from '../modules/library';
import { currentTrack$ } from '../modules/player';
import { RouterLink } from '../router';

export const Player = () => {
  const editVolume$ = $(false);
  const volumeControlsClasses$ = useMemo(() => !editVolume$() && 'opacity-0 pointer-events-none');

  return (
    <If when={currentTrack$}>
      <div class='sticky top-0 m-x--4 m-t--4 p-4 p-b-0 bg-dark-400 z-1 after:(content-none block absolute top-100% left-0 right-0 h-4 c-dark-400 bgi-[linear-gradient(currentColor,transparent)])'>
        <HeroImage
          image={() => currentTrack$()?.cover!}
          title={() => currentTrack$()?.title}
          sublines={[
            <RouterLink href={() => `/artist/${encodeURIComponent(currentTrack$()?.artist!)}`}>
              {() => currentTrack$()?.artist}
            </RouterLink>,
          ]}
          mobileComp={HeroImageMobilePlayer}
        />
        <Progress bg='bg-dark-800' class='m-t-2' />
        <div class='flex items-center'>
          <div class='flex-1'>
            <button
              onClick={() => editVolume$(false)}
              class={['w-8 h-8 i-mdi-chevron-right', volumeControlsClasses$]}
            />
          </div>
          <div class='relative'>
            <MainControls />
            <div
              class={[
                'absolute inset-0 p-x-4 flex items-center bg-dark-400 transition',
                volumeControlsClasses$,
              ]}
            >
              <Slider bg='bg-dark-800' />
            </div>
          </div>
          <div class='flex-1 flex justify-end'>
            <button
              onClick={() => (editVolume$() ? (state.mute = !state.mute) : editVolume$(true))}
              class={['w-8 h-8', volumeIcon$]}
            />
          </div>
        </div>
        Queue
      </div>
      <TrackList trackIds={cleanQueue$} stickToActiveTrack showIndex />
    </If>
  );
};
