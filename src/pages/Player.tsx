import { If } from 'voby';
import { TrackList } from '../components/TrackList';
import { RouterLink } from '../router';
import { currentTrack$ } from '../modules/player';
import { HeroImage } from '../components/HeroImage';
import { HeroImageMobilePlayer } from '../components/HeroImage/MobilePlayer';
import { MainControls } from '../components/Player/MainControls';
import { Progress } from '../components/Player/Progress';
import { state } from '../modules/library';

export const Player = () => {
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
        <MainControls />
        Queue
      </div>
      {() => <TrackList tracks={state.queue || []} stickToActiveTrack />}
    </If>
  );
};
