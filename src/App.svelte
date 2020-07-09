<script>
  import { loadFile } from "./reader/loader";

  let content = "";
  let zip = null;

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

  const press = event => {
    console.log(`Pressed`, event.target);
  };
</script>

<main>
  <input
    on:change={handleZip}
    type="file"
    name="file"
    accept="application/zip" />
  <div id="content" on:click={press}>
    {@html content}
  </div>
</main>
