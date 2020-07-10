<script>
  import Controls from "./controls/controls.svelte";
  import { loadFile } from "./reader/loader";
  import { readContentDOM } from "./reader/reader";
  import { getAudioSource } from "./reader/audio";

  let content = "";
  let zip;
  let ref;
  let audioRef;

  const handleZip = async event => {
    try {
      const [file] = event.target.files;

      const { dom, zip: zipObj } = await loadFile(file);

      content = dom.parentElement.innerHTML;
      zip = zipObj;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const play = (audio, element) =>
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

          await sleep(200);

          audioRef.play();
        };

        audioRef.addEventListener("canplaythrough", onStart);
      } catch (error) {
        return Promise.reject(error);
      }
    });

  const onTextSelect = async event => {
    const walker = readContentDOM(event.target);

    const getAudioUrl = getAudioSource(zip);

    for (const element of walker) {
      console.log(element);
      const audioUrl = await getAudioUrl(element);

      if (audioUrl) {
        await play(audioUrl, element);
      }
    }
  };

  const onLoad = () => {
    if (ref && ref.children.length) {
      console.log("loaded");
    }
  };

  $: content, setTimeout(onLoad, 0);
</script>

<main>
  {#if !content}
    <section class="file-input-section">
      <input
        on:change={handleZip}
        aria-label="File"
        type="file"
        name="file"
        accept="application/zip" />
    </section>
  {/if}
  <section class="content">
    <div id="content" bind:this={ref} on:click={onTextSelect}>
      {@html content}
    </div>
  </section>
  <audio bind:this={audioRef} />
</main>
