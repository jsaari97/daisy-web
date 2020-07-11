<script>
  import Button from "./button.svelte";

  export let playing = false;
  export let disabled;
  export let onPlayToggle;
  export let onBackward;
  export let onForward;
</script>

<style>
  .controls {
    position: fixed;
    width: 100%;
    padding: 0.5rem 0;
    bottom: 0;
    background-color: #fff;
    border-top: 1px solid #e1e1e1;
  }

  .controls__container {
    max-width: 48rem;
    width: calc(100% - 2rem);
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
</style>

<section class="controls">
  <div class="controls__container">
    <Button {disabled} on:click={onBackward}>Backward</Button>

    <Button {disabled} on:click={onPlayToggle}>
      {playing ? 'Pause' : 'Play'}
    </Button>

    <Button {disabled} on:click={onForward}>Forward</Button>
  </div>
</section>
