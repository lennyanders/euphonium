import { If, Ternary, useMemo } from 'voby';

import { AlbumList } from '../components/AlbumList';
import { HeroImage } from '../components/HeroImage';
import { TrackList } from '../components/TrackList';
import { state } from '../modules/library';
import { params, RouterLink } from '../router';

export const Artist = () => {
  const artist$ = useMemo(() => state.artistData[params.artistName!]);
  return (
    <Ternary when={artist$}>
      <>
        <HeroImage
          image={() => artist$()?.image!}
          title={() => artist$()?.name}
          sublines={[
            <>
              {() => artist$()?.tracks.length} <div class='i-mdi-music-note m-l-.5 m-r-2' />
              <If when={() => artist$()?.albums.length}>
                {() => artist$()?.albums.length} <div class='i-mdi-disk m-l-.5 m-r-2' />
              </If>
              {() => artist$()?.durationFormatted} <div class='i-mdi-timer-sand m-l-.5' />
            </>,
          ]}
        />
        <If when={() => artist$()?.albums.length}>
          <RouterLink
            href={() => `/tracks/${encodeURIComponent(artist$()?.name!)}`}
            class='flex gap-4 items-center'
          >
            <div class='w-8 i-mdi-music-circle' />
            <div>
              All artist songs
              <small class='lh-[1] block'>{() => artist$()?.tracks.length}</small>
            </div>
          </RouterLink>
          <h2>Albums ({() => artist$()?.albums.length})</h2>
          <AlbumList albumIds={useMemo(() => artist$()?.albums!)} />
        </If>
        <If when={() => artist$()?.singles.length}>
          <h2>Singles ({() => artist$()?.singles.length})</h2>
          <TrackList trackIds={useMemo(() => artist$()?.singles!)} />
        </If>
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
