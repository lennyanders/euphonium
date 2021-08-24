import { mdiClose } from '@mdi/js';
import { Icon } from '../icon';
import { postMessage } from '../../utils/worker';
import { libraryEntry } from './index.css';

export const LibraryEntry = ({ id, name }: { id: number; name: string }) => (
  <li class={libraryEntry}>
    {name}
    <button onClick={() => postMessage({ message: 'removeLibraryDirectory', id })}>
      <Icon path={mdiClose} />
    </button>
  </li>
);
