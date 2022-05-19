import { Footer } from './components/layout/Footer';
import { Router } from './router';

export const App = () => {
  return (
    <div class='w-120 max-w-100% m-a h-100% sm:h-90% bg-[#222] overflow-y-auto relative'>
      <Router routes={[{ path: '*', component: 'Error' }]} />
      <Footer />
    </div>
  );
};
