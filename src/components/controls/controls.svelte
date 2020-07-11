<script>
  export let playing = false;
  export let onPlayToggle;
  export let onBackward;
  export let onForward;
</script>

<style>
  .controls {
    position: fixed;
    width: 100%;
    padding: 1rem;
    bottom: 0;
  }

  .controls__container {
    max-width: 48rem;
    width: calc(100% - 2rem);
    margin: 0 auto;
  }
</style>

<section class="controls">
  <div class="controls__container">
    <button on:click={onBackward} type="button">Back</button>

    <button on:click={onPlayToggle} type="button">
      {playing ? 'Pause' : 'Play'}
    </button>

    <button on:click={onForward} type="button">Forward</button>
  </div>
</section>
