import { For } from 'voby';

import { path$, RouterLink } from '../router';

type IconLink = { href: string; icon: string; title: string };

const mainLinks: IconLink[] = [
  { href: '/search', icon: 'i-mdi-search', title: 'Search' },
  { href: '/tracks', icon: 'i-mdi-music-note', title: 'Tracks' },
  { href: '/albums', icon: 'i-mdi-disk', title: 'Albums' },
  { href: '/artists', icon: 'i-mdi-account-multiple-outline', title: 'Artists' },
  { href: '/album-artists', icon: 'i-mdi-account-music-outline', title: 'Album Artists' },
  { href: '/settings', icon: 'i-mdi-cog-outline', title: 'Settings' },
];

const secondaryLinks: IconLink[] = [
  { href: '/about', icon: 'i-mdi-information-outline', title: 'About' },
  { href: '/privacy', icon: 'i-mdi-shield-half-full', title: 'Privacy Policy' },
];

const LinkList = ({ links }: { links: IconLink[] }) => (
  <For values={links}>
    {({ href, icon, title }) => (
      <li>
        <RouterLink
          class={[
            'flex items-center gap-2 transition-opacity',
            () => path$() !== href && 'lg:op-66',
          ]}
          href={href}
        >
          <div class={icon} />
          {title}
        </RouterLink>
      </li>
    )}
  </For>
);

export const Home = () => [
  <ul class='grid gap-2'>
    <LinkList links={mainLinks} />
  </ul>,
  <ul class='grid gap-2 m-t-a p-t-12 text-sm op-75'>
    <LinkList links={secondaryLinks} />
  </ul>,
];
