<script>
	import JSZip from "jszip/dist/jszip.min.js";

  const handleZip = async event => {
    try {
      const [file] = event.target.files;

			const zip = await JSZip.loadAsync(file);
			
			const name = 'Are_you_ready_z3986/AreYouReadyV3.xml'
			
			const main = await zip.file(name).async('string')

      console.log(zip, main);
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
