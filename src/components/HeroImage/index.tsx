import { FunctionMaybe, Ternary } from 'voby';

import { w640$ } from '../../modules/layout';
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
  return (
    <Ternary when={w640$}>
      <HeroImageDesktop {...props} />
      <MobileComp {...props} />
    </Ternary>
  );
};
