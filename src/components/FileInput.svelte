<script>
  export let disabled = false;

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
  section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: calc(100% - 2rem);
    height: 8rem;
    border: 1px solid #e1e1e1;
    max-width: 24rem;
    border-radius: 0.5rem;
    background-color: #f9f9f9;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 22px 16px -16px rgba(0, 0, 0, 0.05);
  }

  .container.dragging {
    background-color: #e9e9e9;
    border-color: #f1f1f1;
  }

  .container.disabled {
    opacity: 0.5;
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

  .separator {
    margin-top: 1.5rem;
    font-style: italic;
    color: #727272;
  }

  button {
    background-color: #3c40c6;
    color: #fff;
    margin-top: 1.5rem;
    font-size: 0.825rem;
    font-weight: bolder;
  }

  button[disabled] {
    opacity: 0.5;
  }
</style>

<section>
  <div
    class="container"
    class:dragging
    class:disabled
    on:dragover={handleDragging}
    on:dragleave={handleDragEnd}
    on:drop={handleDragEnd}>
    <input
      {disabled}
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
  <span aria-hidden="true" class="separator">or</span>
  <button {disabled} type="button" on:click>Load Example</button>
</section>
