import { If } from 'voby';
import { TrackList } from '../components/TrackList';
import { RouterLink } from '../router';
import { currentTrack$, queue$ } from '../modules/player';
import { HeroImage } from '../components/HeroImage';
import { HeroImageMobilePlayer } from '../components/HeroImage/MobilePlayer';
import { MainControls } from '../components/Player/MainControls';
import { Progress } from '../components/Player/Progress';

export const Player = () => {
  return (
    <If when={currentTrack$}>
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
      <Progress bg='bg-[#191919]' />
      <MainControls />
      <div>Queue</div>
      {() => <TrackList tracks={queue$() || []} />}
    </If>
  );
};
