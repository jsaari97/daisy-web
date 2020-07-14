<script>
  export let disabled = false;
  export let icon = null;
  export let primary = false;
</script>

<style>
  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.725rem;
    background: transparent;
    padding: 0 0.75rem;
  }

  button > div {
    height: 2.5rem;
    width: 2.5rem;
    border: 2px solid #3c40c6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.375rem;
  }

  button :global(svg) {
    fill: #3c40c6;
    height: 1.25rem;
    width: 1.25rem;
  }

  button.primary > div {
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
  type="button">
  <div aria-hidden="true">
    <svelte:component this={icon} />
  </div>
  <slot />
</button>
