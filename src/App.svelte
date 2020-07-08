<script>
  import { loadFile } from "./reader/loader";

  let content = "";

  const handleZip = async event => {
    try {
      const [file] = event.target.files;

      const html = await loadFile(file);

      content = html.parentElement.innerHTML;
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
