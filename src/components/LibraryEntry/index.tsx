import { mdiClose } from '@mdi/js';
import { Icon } from '../icon';
import { postMessage } from '../../utils/worker';
import { libraryEntry, close } from './index.css';

export const LibraryEntry = ({ id, name }: { id: number; name: string }) => (
  <li class={libraryEntry}>
    {name}
    <button class={close} onClick={() => postMessage({ message: 'removeLibraryDirectory', id })}>
      <Icon path={mdiClose} />
    </button>
  </li>
);
