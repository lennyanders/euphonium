<script setup lang="ts">
  import { DirectoryRelationType } from '../../shared/workerCommunicationTypes';
  import { state } from '../modules/library';
  import { requestFileAccess } from '../utils';
  import { onMessage, postMessage } from '../utils/worker';

  onMessage(async ({ data }) => {
    if (data.message !== 'requestPermission') return;

    if (await requestFileAccess()) return postMessage({ message: 'reloadLibrary' });

    alert(
      "You need to give permission or you can't use this app. Reload/Reopen and try again if it was a mistake",
    );
  });

  const addDirectoryToLibrary = async () => {
    const directoryHandle = await showDirectoryPicker();
    postMessage({ message: 'tryAddDirectoryToLibrary', directoryHandle });
    const unlisten = onMessage(({ data }) => {
      if (data.message !== 'tryAddDirectoryToLibrary') return;

      unlisten();
      const getDirName = (id: number) => state.libraryDirectories?.find((d) => d.id === id)?.name;
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
</script>

<template>
  <h1>Settings</h1>
  <h2>Library</h2>
  <div class="main-actions">
    <button :disabled="state.importing" @click="addDirectoryToLibrary">
      Add directory to library
    </button>
    <button :disabled="state.importing" @click="() => postMessage({ message: 'reloadLibrary' })">
      Refresh
    </button>
  </div>
  <ul v-if="state.libraryDirectories?.length" :class="{ importing: state.importing }">
    <li v-for="{ name, id } of state.libraryDirectories" :key="id">
      {{ name }}
      <button
        class="remove-button"
        :disabled="state.importing"
        @click="() => postMessage({ message: 'removeLibraryDirectory', id })"
      >
        ×
      </button>
    </li>
  </ul>
  <p v-else>Add directories and start listening to music!</p>
  <small class="w-80% op-50">
    You need to give permission again for each folder after reloading/revisiting the player so it's
    good to use as few folders as possible
  </small>
</template>

<style scoped>
  .main-actions {
    display: flex;
    gap: 0.5rem;
  }

  .main-actions button {
    padding: 0.25rem 0.5rem;
    background-color: #080808;
    transition: background-color 0.2s ease;

    &:enabled:hover {
      background-color: black;
    }
  }

  ul {
    display: grid;
    gap: 0.5rem;
    transition: opacity 0.2s ease;
  }

  ul.importing {
    opacity: 0.5;
  }

  .remove-button {
    color: inherit;
  }

  small {
    color: #ccc;
  }
</style>
