<script>
  let dragging = false;

  function handleDragging() {
    if (!dragging) {
      dragging = true;
    }
  }

  function handleDragEnd() {
    dragging = false;
  }
</script>

<style>
  .file-input__section {
    min-height: 100vh;
    display: flex;
  }

  .file-input__container {
    width: calc(100% - 2rem);
    height: 8rem;
    border: 1px solid #e1e1e1;
    max-width: 24rem;
    border-radius: 0.5rem;
    background-color: #f9f9f9;
    margin: auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 22px 16px -16px rgba(0, 0, 0, 0.05);
  }

  .file-input__container.dragging {
    background-color: #e9e9e9;
    border-color: #f1f1f1;
  }

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  label {
    display: block;
  }
</style>

<section class="file-input__section">
  <div
    class="file-input__container"
    class:dragging
    on:dragover={handleDragging}
    on:dragleave={handleDragEnd}
    on:drop={handleDragEnd}
    >
    <input
      on:change
      aria-label="File"
      type="file"
      name="file"
      id="file-input"
      accept="application/zip" />
    <label for="file-input">
      <strong>Choose a book file</strong>
      or drag it here
    </label>
  </div>
</section>
