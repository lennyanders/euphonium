import { $, FunctionMaybe, Ternary } from 'voby';
import { HeroImageDesktop } from './Desktop';
import { HeroImageMobile } from './Mobile';
import { HeroImageMobilePlayer } from './MobilePlayer';

export interface HeroImageProps {
  image?: FunctionMaybe<string>;
  title: FunctionMaybe<JSX.Element>;
  sublines?: FunctionMaybe<JSX.Element[]>;
}

export const HeroImage = ({
  mobileComp: MobileComp,
  ...props
}: HeroImageProps & {
  mobileComp?: typeof HeroImageMobile | typeof HeroImageMobilePlayer;
}) => {
  MobileComp ||= HeroImageMobile;
  const desktopMatcher = matchMedia('(min-width: 640px)');
  const desktop$ = $(desktopMatcher.matches);
  desktopMatcher.addEventListener('change', ({ matches }) => desktop$(matches));
  return (
    <Ternary when={desktop$}>
      <HeroImageDesktop {...props} />
      <MobileComp {...props} />
    </Ternary>
  );
};
