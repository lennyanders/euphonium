import { For, If } from 'voby';
import { library } from '../stores/library';
import { onMessage, postMessage } from '../utils/worker';
import { DirectoryRelationType } from '../worker/track';

const addDirectoryToLibrary = async (directories: { name: string; id: number }[]) => {
  const directoryHandle = await showDirectoryPicker();
  postMessage({ message: 'tryAddDirectoryToLibrary', directoryHandle });
  const unlisten = onMessage(({ data }) => {
    if (data.message !== 'tryAddDirectoryToLibrary') return;

    unlisten();
    const getDirName = (id: number) => directories.find((d) => d.id! === id)?.name;
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
  if (data.message !== 'requestPermission') return;

  try {
    await data.directoryHandle.requestPermission();
    postMessage({ message: 'reloadLibrary' });
  } catch (_) {}
});

export const Settings = () => {
  const { libraryDirectories } = library();

  return (
    <div class='grid gap-4'>
      <h1>Settings</h1>
      <h2>Library</h2>
      <div class='flex justify-between'>
        <button onClick={() => addDirectoryToLibrary(libraryDirectories)}>
          Add directory to library
        </button>
        <button onClick={() => postMessage({ message: 'reloadLibrary' })}>Refresh</button>
      </div>
      <If
        when={libraryDirectories.length}
        fallback={<p>Add directories and start listening to music!</p>}
      >
        <ul class='grid gap-2'>
          <For values={libraryDirectories}>
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
      </If>
    </div>
  );
};
