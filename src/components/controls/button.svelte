<script>
  export let disabled = false;
  export let icon = null;
</script>

<style>
  button {
    width: 6rem;
    border: 0;
    outline: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 0;
    font-size: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #e1e1e1;
    background-color: #f9f9f9;
  }

  button:not(:last-of-type) {
    margin-right: 1rem;
  }

  button > :global(svg) {
    fill: #424242;
    height: 1.5rem;
    width: 1.5rem;
    margin-bottom: 0.5rem;
  }

  button[disabled] > :global(svg) {
    fill: #aaa;
  }
</style>

<button {disabled} aria-disabled={disabled} on:click type="button">
  <svelte:component this={icon} />
  <slot />
</button>
