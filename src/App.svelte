<script>
  import { loadFile } from "./reader/loader";
  import { readNode, handleNode } from "./reader/reader";

  let content = "";
  let zip;
  let ref;

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

  const press = async event => {
    await readNode(event.target, handleNode(zip));
  };

  const read = () => {
    if (ref && ref.children.length) {
      console.log("initialize");
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
</main>
