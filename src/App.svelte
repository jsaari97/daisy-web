<script>
  import Controls from "./components/controls/controls.svelte";
  import FileInput from "./components/FileInput.svelte";

  import { loadFile } from "./reader/loader";
  import { readContentDOM, lookBackward, lookForward } from "./reader/reader";
  import { getAudioSource } from "./reader/audio";
  import { autoscroll } from "./utils/autoscroll";

  let content = "";
  let zip;
  let ref;
  let cursor;
  let audioRef;
  let walker;
  let playing = false;
  let cache = {};

  const loadDocument = async event => {
    try {
      const [file] = event.target.files;

      const result = await loadFile(file);

      content = result.dom.parentElement.innerHTML;
      zip = result.zip;
    } catch (error) {
      console.warn(error);
    }
  };

  const stopPlayback = () => {
    walker.return();
    audioRef.pause();
    cursor.style.background = "transparent";
  };

  const playAudio = (audio, element) =>
    new Promise(async resolve => {
      try {
        audioRef.src = audio;

        const onCompleted = () => {
          audioRef.pause();
          audioRef.removeEventListener("pause", onCompleted);
          element.style.background = "transparent";

          return resolve();
        };

        const onStart = async () => {
          audioRef.addEventListener("pause", onCompleted);
          audioRef.removeEventListener("canplaythrough", onStart);
          element.style.background = "yellow";

          audioRef.play();
        };

        audioRef.addEventListener("canplaythrough", onStart);
      } catch (error) {
        return Promise.reject(error);
      }
    });

  const readDocument = async () => {
    walker = readContentDOM(cursor);

    const getAudioUrl = getAudioSource(zip, cache);

    for (const element of walker) {
      console.log(element);
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

  const onContentSelect = event => {
    if (playing) {
      stopPlayback();
    }

    cursor = event.target;
    playing = true;
    readDocument();
  };

  const onDocumentLoad = () => {
    if (ref && ref.children.length) {
      cursor = ref;
    }
  };

  const togglePlay = () => {
    if (playing) {
      stopPlayback();
    } else {
      readDocument();
    }

    playing = !playing;
  };

  const controlHandler = handler => () => {
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

  // Keyboard events
  window.addEventListener("keydown", event => {
    if (content) {
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
    }
  });

  $: content, setTimeout(onDocumentLoad, 0);
</script>

<style>
  main {
    min-height: 100vh;
  }
</style>

<main>
  {#if !content}
    <FileInput on:change={loadDocument} />
  {/if}
  {#if content}
    <section class="content">
      <div id="content" bind:this={ref} on:click={onContentSelect}>
        {@html content}
      </div>
    </section>
  {/if}
  <audio bind:this={audioRef} />
  <Controls
    {playing}
    disabled={!content}
    onPlayToggle={togglePlay}
    onBackward={handlePrevious}
    onForward={handleForward} />
</main>
