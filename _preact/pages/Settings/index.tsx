import { useContext } from 'preact/hooks';
import { Store } from '../../store';
import { LibraryEntry } from '../../components/LibraryEntry';
import { onMessage, postMessage } from '../../utils/worker';
import { DirectoryRelationType } from '../../worker/track/getDirectoryRelation';
import { list } from './index.css';

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

export const Settings = ({}: { path: string }) => {
  const { libraryDirectories } = useContext(Store)!;
  return (
    <>
      <h1>Settings</h1>
      <h2>Library</h2>
      <button onClick={() => addDirectoryToLibrary(libraryDirectories)}>
        Add directory to library
      </button>
      {libraryDirectories.length ? (
        <ul class={list}>
          {libraryDirectories.map(({ id, name }) => (
            <LibraryEntry id={id} name={name} />
          ))}
        </ul>
      ) : (
        <p>Add directories and start listening to music!</p>
      )}
    </>
  );
};
