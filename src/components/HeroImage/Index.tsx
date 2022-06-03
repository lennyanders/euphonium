import { $, Ternary } from 'voby';
import { HeroImageDesktop } from './Desktop';
import { HeroImageMobile } from './Mobile';
import { HeroImageMobilePlayer } from './MobilePlayer';

export const HeroImage = (props: {
  image?: string;
  title: JSX.Element;
  sublines?: JSX.Element[];
  mobileComp?: typeof HeroImageMobile | typeof HeroImageMobilePlayer;
}) => {
  console.log(props.mobileComp);

  props.mobileComp ||= HeroImageMobile;
  const desktopMatcher = matchMedia('(min-width: 640px)');
  const desktop$ = $(desktopMatcher.matches);
  desktopMatcher.addEventListener('change', ({ matches }) => desktop$(matches));
  return (
    <Ternary when={desktop$}>
      <HeroImageDesktop {...props} />
      <props.mobileComp {...props} />
    </Ternary>
  );
};
