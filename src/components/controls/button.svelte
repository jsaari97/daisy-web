<script>
  export let disabled = false;
  export let icon = null;
  export let primary = false;
  export let label = "";
</script>

<style>
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.725rem;
    background: transparent;
    margin: 0 0.75rem;
    padding: 0;
    height: 2.5rem;
    width: 2.5rem;
    border: 2px solid #3c40c6;
    border-radius: 50%;
  }

  button :global(svg) {
    fill: #3c40c6;
    height: 1.25rem;
    width: 1.25rem;
  }

  button.primary {
    height: 3.25rem;
    width: 3.25rem;
    background: #3c40c6;
  }

  button.primary :global(svg) {
    fill: #fff;
    height: 1.5rem;
    width: 1.5rem;
  }

  button[disabled] {
    opacity: 0.5;
  }
</style>

<button
  class:primary
  {disabled}
  aria-disabled={disabled}
  on:click
  aria-label={label}
  type="button">
  <svelte:component this={icon} aria-hidden="true" />
</button>
