import { $$, If, Ternary, useMemo } from 'voby';

import { HeroImage } from '../components/HeroImage';
import { TrackList } from '../components/TrackList';
import { state } from '../modules/library';
import { params } from '../router';

export const Album = () => {
  const album$ = useMemo(() => state.albumData[`${params.artist}${params.albumTitle}`]);
  return (
    <Ternary when={album$}>
      <>
        <HeroImage
          image={() => $$(album$)?.cover!}
          title={() => $$(album$)?.title}
          sublines={[
            <a href={() => `/artist/${encodeURIComponent($$(album$)?.artist)}`}>
              {() => $$(album$)?.artist}
            </a>,
            <>
              <If when={() => $$(album$)?.year}>
                {() => $$(album$)?.year} <div class='i-mdi-candle m-l-.5 m-r-2' />
              </If>
              {() => $$(album$)?.tracks.length} <div class='i-mdi-music-note m-l-.5 m-r-2' />
              {() => $$(album$)?.diskCount} <div class='i-mdi-disk m-l-.5 m-r-2' />
              {() => $$(album$)?.durationFormatted} <div class='i-mdi-timer-sand m-l-.5' />
            </>,
          ]}
        />
        <TrackList
          trackIds={useMemo(() => $$(album$)?.tracks)}
          showNumber
          showDiskOnTracks={useMemo(() => $$(album$)?.showDiskOnTracks)}
        />
      </>
      {/* no album */}
      <p>
        You don't have that album in you'r library, add directories in the
        <a href='/settings' class='underline'>
          settings
        </a>
        and start listening to music!
      </p>
    </Ternary>
  );
};
