import { mdiAlbum, mdiClockTimeFour, mdiMusicNote } from '@mdi/js';
import { useContext, useMemo } from 'preact/hooks';
import { Icon } from '../../components/icon';
import { Store } from '../../store';
import { getFormattedTime } from '../../utils';
import { badgeClass, artistClass, artistNameClass, artistListClass } from './index.css';

export const Artists = ({}: { path: string }) => {
  const { tracks } = useContext(Store)!;

  const artists = useMemo(() => {
    const artistsObject: Record<string, { tracks: number; duration: number; albums: Set<string> }> =
      {};
    for (const { artist, duration, albumTitle, albumArtist } of tracks) {
      const key = artist || 'unknown artist';
      const artistObject = artistsObject[key];
      if (artistObject) {
        artistObject.tracks += 1;
        artistObject.duration += duration;
        if (albumTitle && artist === albumArtist) artistObject.albums.add(albumTitle);
      } else {
        artistsObject[key] = {
          tracks: 1,
          duration,
          albums: new Set(albumTitle && artist === albumArtist ? [albumTitle] : null),
        };
      }
    }
    return Object.entries(artistsObject).map(([name, { tracks, duration, albums }]) => ({
      name,
      tracks,
      duration: getFormattedTime(duration),
      albums: albums.size,
    }));
  }, [tracks]);

  return (
    <>
      <h1>Artists</h1>
      <ul class={artistListClass}>
        {artists.map((artist) => (
          <li key={artist.name} class={artistClass}>
            <h2 class={artistNameClass}>{artist.name}</h2>
            <span class={badgeClass}>
              <Icon path={mdiMusicNote} />
              {artist.tracks}
            </span>
            {artist.albums > 0 && (
              <span class={badgeClass}>
                <Icon path={mdiAlbum} />
                {artist.albums}
              </span>
            )}
            <span class={badgeClass}>
              <Icon path={mdiClockTimeFour} />
              {artist.duration}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
