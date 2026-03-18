<script>
  import { onMount } from "svelte";

  import FileInput from "./components/FileInput.svelte";
  import Loading from "./components/Loading.svelte";
  import Controls from "./components/controls/controls.svelte";
  import { getAudioSource } from "./reader/audio";
  import { loadFile } from "./reader/loader";
  import { readContentDOM, lookBackward, lookForward } from "./reader/reader";
  import { autoscroll } from "./utils/autoscroll";

  const baseUrl = import.meta.env.BASE_URL;

  let content = "";
  let zip;
  let ref;
  let cursor;
  let audioRef;
  let walker;
  let playing = false;
  let loading = false;
  let cache = {};

  onMount(async () => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (import.meta.env.DEV) {
      const registrations = await navigator.serviceWorker.getRegistrations();

      registrations.forEach((registration) => registration.unregister());
      return;
    }

    navigator.serviceWorker.register(`${baseUrl}service-worker.js`);
  });

  const loadDocument = async (event) => {
    try {
      const [file] = event.target.files;

      if (!file.name.match(/\.zip$/)) {
        return Promise.reject("File must be in .zip format.");
      }

      loading = true;

      const result = await loadFile(file);

      content = result.dom.parentElement.innerHTML;
      zip = result.zip;
    } catch (error) {
      console.warn(error);
    } finally {
      loading = false;
    }
  };

  const stopPlayback = () => {
    if (walker) {
      walker.return();
    }

    audioRef.pause();

    if (cursor?.classList) {
      cursor.classList.remove("active");
    }
  };

  function playAudio(audio, element) {
    return new Promise(async (resolve) => {
      try {
        audioRef.src = audio;

        const onCompleted = () => {
          audioRef.pause();
          audioRef.removeEventListener("pause", onCompleted);
          element.classList.remove("active");

          return resolve();
        };

        const onStart = async () => {
          audioRef.addEventListener("pause", onCompleted);
          audioRef.removeEventListener("canplaythrough", onStart);
          element.classList.add("active");

          audioRef.play();
        };

        audioRef.addEventListener("canplaythrough", onStart);
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }

  const readDocument = async () => {
    walker = readContentDOM(cursor);

    const getAudioUrl = getAudioSource(zip, cache);

    for (const element of walker) {
      const audioUrl = await getAudioUrl(element);

      if (audioUrl) {
        cursor = element;

        if (element.offsetHeight) {
          autoscroll(element);
        }

        await playAudio(audioUrl, element);
      }
    }
  };

  const onContentSelect = (event) => {
    if (playing) {
      stopPlayback();
    }

    cursor = event.target;
    playing = true;
    readDocument();
  };

  const onContentKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onContentSelect(event);
    }
  };

  const onDocumentLoad = () => {
    if (ref && ref.children.length) {
      cursor = ref;
    }
  };

  async function loadExample() {
    try {
      loading = true;
      const response = await fetch(`${baseUrl}samples/are-you-ready-z3986.zip`);

      if (!response.ok) {
        throw new Error(`Failed to load sample file: ${response.status}`);
      }

      const data = await response.blob();
      const result = await loadFile(data);

      content = result.dom.parentElement.innerHTML;
      zip = result.zip;
    } catch (error) {
      console.warn(error);
    } finally {
      loading = false;
    }
  }

  const togglePlay = () => {
    if (playing) {
      stopPlayback();
    } else {
      readDocument();
    }

    playing = !playing;
  };

  const controlHandler = (handler) => () => {
    const element = handler(cursor);

    if (element) {
      if (playing) {
        stopPlayback();
      }

      playing = true;
      cursor = element;
      readDocument();
    }
  };

  const handlePrevious = controlHandler(lookBackward);
  const handleForward = controlHandler(lookForward);

  const onKeyDown = (event) => {
    if (!content) {
      return;
    }

    switch (event.code) {
      case "ArrowLeft":
        event.preventDefault();
        handlePrevious();
        return;
      case "ArrowRight":
        event.preventDefault();
        handleForward();
        return;
      case "Space":
        event.preventDefault();
        togglePlay();
        return;
      default:
        return;
    }
  };

  $: content, setTimeout(onDocumentLoad, 0);
</script>

<svelte:window on:keydown={onKeyDown} />

<main>
  {#if !content}
    <FileInput
      on:change={loadDocument}
      on:click={loadExample}
      disabled={loading}
    />
  {/if}
  {#if content}
    <section class="content">
      <div
        id="content"
        bind:this={ref}
        on:click={onContentSelect}
        on:keydown={onContentKeyDown}
        role="button"
        tabindex="0">
        {@html content}
      </div>
    </section>
  {/if}
  <audio bind:this={audioRef}></audio>
  <Controls
    {playing}
    disabled={!content}
    onPlayToggle={togglePlay}
    onBackward={handlePrevious}
    onForward={handleForward}
  />
  {#if loading}
    <Loading />
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
  }
</style>
