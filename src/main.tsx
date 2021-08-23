import { render } from 'preact';
import { onMessage, postMessage } from './utils/worker';
import { Store, useStore } from './store';
import { DirectoryRelationType } from './worker/file/getDirectoryRelation';

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

const App = () => {
  const store = useStore();
  if (!store) return <div>loading...</div>;

  return (
    <Store.Provider value={store}>
      <h1>Library</h1>
      <button onClick={() => addDirectoryToLibrary(store.libraryDirectories)}>
        Add directory to library
      </button>
      {store.libraryDirectories.length ? (
        <ul>
          {store.libraryDirectories.map(({ id, name }) => (
            <li key={id}>
              {name}
              <button onClick={() => postMessage({ message: 'removeLibraryDirectory', id })}>
                x
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Add directories and start listening to music!</p>
      )}
    </Store.Provider>
  );
};

render(<App />, document.body);
