<script>
  import Controls from "./components/controls/controls.svelte";
  import { loadFile } from "./reader/loader";
  import { readContentDOM } from "./reader/reader";
  import { getAudioSource } from "./reader/audio";

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

  const handlePrevious = () => {};

  const handleNext = () => {};

  $: content, setTimeout(onDocumentLoad, 0);
</script>

<main>
  {#if !content}
    <section class="file-input-section">
      <input
        on:change={loadDocument}
        aria-label="File"
        type="file"
        name="file"
        accept="application/zip" />
    </section>
  {/if}
  <section class="content">
    <div id="content" bind:this={ref} on:click={onContentSelect}>
      {@html content}
    </div>
  </section>
  <audio bind:this={audioRef} />
  <Controls
    {playing}
    onPlayToggle={togglePlay}
    onPrevious={handlePrevious}
    onNext={handleNext} />
</main>
