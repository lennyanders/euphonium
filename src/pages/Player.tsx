import { $, If, useComputed } from 'voby';
import { TrackList } from '../components/TrackList';
import { RouterLink } from '../router';
import { currentTrack$, queue$ } from '../modules/player';
import { HeroImage } from '../components/HeroImage';
import { HeroImageMobilePlayer } from '../components/HeroImage/MobilePlayer';
import { MainControls } from '../components/Player/MainControls';
import { Progress } from '../components/Player/Progress';
import { Slider, volumeIcon$ } from '../components/Player/Volume';
import { state } from '../modules/library';

export const Player = () => {
  const editVolume$ = $(false);
  const volumeControlsClasses$ = useComputed(
    () => !editVolume$() && 'opacity-0 pointer-events-none',
  );

  return (
    <If when={currentTrack$}>
      <div class='sticky top-0 m-x--4 m-t--4 p-4 p-b-0 bg-[#222] z-1 after:(content-none block absolute top-100% left-0 right-0 h-4 bgi-[linear-gradient(#222,transparent)])'>
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
        <Progress bg='bg-[#191919]' css='m-t-2' />
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
                'absolute inset-0 p-x-4 flex items-center bg-[#222] transition',
                volumeControlsClasses$,
              ]}
            >
              <Slider bg='bg-[#191919]' />
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
      {() => <TrackList trackIds={queue$() || []} stickToActiveTrack />}
    </If>
  );
};
