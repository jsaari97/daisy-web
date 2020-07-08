<script>
  import { loadFile } from "./reader/loader";

  const handleZip = async event => {
    try {
      const [file] = event.target.files;

      await loadFile(file);
    } catch (error) {
      console.warn(error);
    }
  };
</script>

<main>
  <input
    on:change={handleZip}
    type="file"
    name="file"
    accept="application/zip" />
</main>
