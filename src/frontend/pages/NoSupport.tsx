import { ternary } from 'oby';
import { FunctionMaybe } from 'voby';

import { fileSystemApiSupport, offscreenCanvasSupport, sharedWorkerSupport } from '../consts';

type EntryParams = {
  support: FunctionMaybe<boolean>;
  link: FunctionMaybe<string>;
  children: JSX.Child;
};
const SupportEntry = ({ support, link, children }: EntryParams) => (
  <li>
    <a class='flex items-center gap-2' href={link}>
      <div class={ternary(support, 'i-mdi-check c-green', 'i-mdi-close c-red')} />
      {children}
    </a>
  </li>
);

const InfoEntry = ({ link, children }: Omit<EntryParams, 'support'>) => (
  <li>
    <a class='flex items-center gap-2' href={link}>
      <div class='i-mdi-information-outline' />
      {children}
    </a>
  </li>
);

export const NoSupport = () => [
  'This app is not supported in your browser, please use a browser that supports the following features:',
  <ul class='grid gap-2'>
    <SupportEntry support={sharedWorkerSupport} link='https://caniuse.com/sharedworkers'>
      Shared Web Workers
    </SupportEntry>
    <SupportEntry support={fileSystemApiSupport} link='https://caniuse.com/native-filesystem-api'>
      File System Access API
    </SupportEntry>
    <SupportEntry support={offscreenCanvasSupport} link='https://caniuse.com/offscreencanvas'>
      OffscreenCanvas
    </SupportEntry>
  </ul>,
  <ul class='flex gap-8 m-t-a p-t-12 text-sm op-75'>
    <InfoEntry link='/about'>About</InfoEntry>
  </ul>,
];
