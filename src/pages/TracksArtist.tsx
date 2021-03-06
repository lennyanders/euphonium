import { Ternary, useComputed } from 'voby';
import { HeroImage } from '../components/HeroImage';
import { TrackList } from '../components/TrackList';
import { params, RouterLink } from '../router';
import { state } from '../modules/library';

export const TracksArtist = () => {
  const artist$ = useComputed(() => state.artistData[params.artistName!]);
  return (
    <Ternary when={artist$}>
      <>
        <HeroImage
          image={() => artist$()?.image!}
          title={() => (
            <>
              All tracks from{' '}
              <RouterLink href={() => `/artist/${encodeURIComponent(artist$()?.name!)}`}>
                {artist$()?.name}
              </RouterLink>
            </>
          )}
          sublines={[
            <>
              {() => artist$()?.tracks.length} <div class='i-mdi-music-note m-l-.5 m-r-2' />
              {() => artist$()?.durationFormatted} <div class='i-mdi-timer-sand m-l-.5' />
            </>,
          ]}
        />
        <TrackList trackIds={useComputed(() => artist$()?.tracks!)} />
      </>
      {/* no artist */}
      <p>
        You don't have any music for this artist, add directories in the
        <RouterLink href='/settings' class='underline'>
          settings
        </RouterLink>
        and start listening to music!
      </p>
    </Ternary>
  );
};
