import { If, Ternary, useComputed } from 'voby';
import { AlbumList } from '../components/AlbumList';
import { HeroImage } from '../components/HeroImage';
import { TrackList } from '../components/TrackList';
import { params$, RouterLink } from '../router';
import { state } from '../modules/library';

export const Artist = () => {
  const artist$ = useComputed(() =>
    state.artists?.find((artist) => artist.name === params$().artistName),
  );
  return (
    <Ternary when={artist$}>
      <>
        <HeroImage
          image={() => artist$()?.image!}
          title={() => artist$()?.name}
          sublines={[
            <>
              {() => artist$()?.trackCount} <div class='i-mdi-music-note m-l-.5 m-r-2' />
              <If when={() => artist$()?.albums.length}>
                {() => artist$()?.albums.length} <div class='i-mdi-disk m-l-.5 m-r-2' />
              </If>
              {() => artist$()?.durationFormatted} <div class='i-mdi-timer-sand m-l-.5' />
            </>,
          ]}
        />
        <If when={() => artist$()?.albums.length}>
          <h2>Albums ({() => artist$()?.albums.length})</h2>
          <AlbumList albumIds={useComputed(() => artist$()?.albums!)} />
        </If>
        <If when={() => artist$()?.singles.length}>
          <h2>Singles ({() => artist$()?.singles.length})</h2>
          <TrackList trackIds={useComputed(() => artist$()?.singles!)} />
        </If>
      </>
      {/* no artist */}
      <p>
        You don't have any music for this artist, add directories in the{' '}
        <RouterLink href='/settings' class='underline'>
          settings
        </RouterLink>{' '}
        and start listening to music!
      </p>
    </Ternary>
  );
};
