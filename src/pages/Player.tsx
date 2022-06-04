import { If } from 'voby';
import { TrackList } from '../components/TrackList';
import { RouterLink } from '../router';
import { getFormattedTime } from '../shared/utils';
import { currentTime$, currentTrack$, queue$ } from '../modules/player';
import { HeroImage } from '../components/HeroImage';
import { HeroImageMobilePlayer } from '../components/HeroImage/MobilePlayer';
import { ProgressBar } from '../components/Player/ProgressBar';
import { MainControls } from '../components/Player/MainControls';

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
      <div class='flex justify-between'>
        <span>{() => getFormattedTime(currentTime$())}</span>
        <span>{() => currentTrack$()?.durationFormatted}</span>
      </div>
      <ProgressBar bg='bg-[#191919]' />
      <MainControls />
      <div>Queue</div>
      {() => <TrackList tracks={queue$() || []} />}
    </If>
  );
};
