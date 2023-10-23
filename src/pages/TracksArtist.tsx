import { $$, Ternary, useMemo } from 'voby';

import { HeroImage } from '../components/HeroImage';
import { TrackList } from '../components/TrackList';
import { state } from '../modules/library';
import { params } from '../router';

export const TracksArtist = () => {
  const artist$ = useMemo(() => state.artistData[params.artistName!]);
  return (
    <Ternary when={artist$}>
      <>
        <HeroImage
          image={() => $$(artist$)?.image!}
          title={() => (
            <a href={() => `/artist/${encodeURIComponent($$(artist$)?.name!)}`}>
              All tracks from {$$(artist$)?.name}
            </a>
          )}
          sublines={[
            <>
              {() => $$(artist$)?.tracks.length} <div class='i-mdi-music-note m-l-.5 m-r-2' />
              {() => $$(artist$)?.durationFormatted} <div class='i-mdi-timer-sand m-l-.5' />
            </>,
          ]}
        />
        <TrackList trackIds={useMemo(() => $$(artist$)?.tracks!)} />
      </>
      {/* no artist */}
      <p>
        You don't have any music for this artist, add directories in the
        <a href='/settings' class='underline'>
          settings
        </a>
        and start listening to music!
      </p>
    </Ternary>
  );
};
