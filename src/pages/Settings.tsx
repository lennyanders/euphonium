import { For, Ternary } from 'voby';

import { state } from '../modules/library';
import { DirectoryRelationType } from '../shared/workerFeCommunicationTypes';
import { requestFileAccess } from '../utils';
import { onMessage, postMessage } from '../utils/worker';

const addDirectoryToLibrary = async (directories?: { name: string; id: number }[]) => {
  const directoryHandle = await showDirectoryPicker();
  postMessage({ message: 'tryAddDirectoryToLibrary', directoryHandle });
  const unlisten = onMessage(({ data }) => {
    if (data.message !== 'tryAddDirectoryToLibrary') return;

    unlisten();
    const getDirName = (id: number) => directories?.find((d) => d.id! === id)?.name;
    const { relation } = data;
    if (relation.type === DirectoryRelationType.DirectoryIsAlreadyImportet) {
      return alert('You already imported this directory');
    }
    if (relation.type === DirectoryRelationType.DirectoryIsInsideImportetDirectory) {
      return alert(
        `this directory is already inside of "${getDirName(
          relation.id,
        )}" you don't need to import it`,
      );
    }
    if (relation.type === DirectoryRelationType.DirectoryIsParentOfImportetDirectories) {
      if (
        confirm(
          `this directory is a parent of the following directories: "${relation.parentOfDirectories
            .map(({ id }) => getDirName(id))
            .join(', ')}", should these get replaced by "${directoryHandle.name}"?`,
        )
      ) {
        postMessage({ message: 'forceAddDirectoryToLibrary', relation, directoryHandle });
      }
    }
  });
};

onMessage(async ({ data }) => {
  if (data.message === 'requestPermission') {
    if (await requestFileAccess()) postMessage({ message: 'reloadLibrary' });
    else {
      alert(
        "You need to give permission or you can't use this app. Reload/Reopen and try again if it was a mistake",
      );
    }
  }
});

export const Settings = () => (
  <>
    <h1>Settings</h1>
    <h2>Library</h2>
    <div class='flex justify-between'>
      <button onClick={() => addDirectoryToLibrary(state.libraryDirectories)}>
        Add directory to library
      </button>
      <button onClick={() => postMessage({ message: 'reloadLibrary' })}>Refresh</button>
    </div>
    <Ternary when={state.libraryDirectories?.length}>
      <ul class='grid gap-2'>
        <For values={state.libraryDirectories!}>
          {({ name, id }) => (
            <li class='flex gap-1'>
              {name}
              <button onClick={() => postMessage({ message: 'removeLibraryDirectory', id })}>
                ×
              </button>
            </li>
          )}
        </For>
      </ul>
      {/* no library directories */}
      <p>Add directories and start listening to music!</p>
    </Ternary>
    <small class='w-80% op-50'>
      You need to give permission again for each folder after reloading/revisiting the player so
      it's good to use as few folders as possible
    </small>
  </>
);
