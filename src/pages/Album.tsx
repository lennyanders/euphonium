import { If, Ternary, useComputed } from 'voby';
import { HeroImage } from '../components/HeroImage';
import { TrackList } from '../components/TrackList';
import { params$, RouterLink } from '../router';
import { state } from '../modules/library';

export const Album = () => {
  const album$ = useComputed(() => state.albumData[`${params$().artist}${params$().albumTitle}`]);
  return (
    <Ternary when={album$}>
      <>
        <HeroImage
          image={() => album$().cover!}
          title={() => album$().title}
          sublines={[
            <RouterLink href={() => `/artist/${encodeURIComponent(album$().artist)}`}>
              {() => album$().artist}
            </RouterLink>,
            <>
              <If when={() => album$().year}>
                {() => album$().year} <div class='i-mdi-candle m-l-.5 m-r-2' />
              </If>
              {() => album$().tracks.length} <div class='i-mdi-music-note m-l-.5 m-r-2' />
              {() => album$().diskCount} <div class='i-mdi-disk m-l-.5 m-r-2' />
              {() => album$().durationFormatted} <div class='i-mdi-timer-sand m-l-.5' />
            </>,
          ]}
        />
        <TrackList
          trackIds={useComputed(() => album$().tracks)}
          showNumber
          showDiskOnTracks={useComputed(() => album$().showDiskOnTracks)}
        />
      </>
      {/* no album */}
      <p>
        You don't have that album in you'r library, add directories in the{' '}
        <RouterLink href='/settings' class='underline'>
          settings
        </RouterLink>{' '}
        and start listening to music!
      </p>
    </Ternary>
  );
};
