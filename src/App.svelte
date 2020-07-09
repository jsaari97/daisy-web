<script>
  import { loadFile } from "./reader/loader";
  import { readNode, handleNode } from "./reader/reader";

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
      console.warn(error);
    }
  };

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const play = (audio, element) =>
    new Promise(async resolve => {
      try {
        audioRef.src = audio;

        const handleEnd = () => {
          audioRef.pause();
          audioRef.removeEventListener("pause", handleEnd);
          element.style.background = 'transparent';

          return resolve();
        };

        const handlePlay = async () => {
          audioRef.addEventListener("pause", handleEnd);
          audioRef.removeEventListener("canplaythrough", handlePlay);
          element.style.background = 'yellow';

          await sleep(200);

          audioRef.play();
        };

        audioRef.addEventListener("canplaythrough", handlePlay);
      } catch (error) {
        console.warn(error);
      }
    });

  const press = async event => {
    await readNode(event.target, handleNode(zip, play));
  };

  const read = () => {
    if (ref && ref.children.length) {
      console.log("loaded");
    }
  };

  $: content, setTimeout(read, 0);
</script>

<main>
  <input
    on:change={handleZip}
    aria-label="File"
    type="file"
    name="file"
    accept="application/zip" />
  <div id="content" bind:this={ref} on:click={press}>
    {@html content}
  </div>
  <audio loop="false" bind:this={audioRef} />
</main>
