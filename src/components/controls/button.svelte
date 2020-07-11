<script>
  export let disabled = false;
</script>

<style>
  button {
    width: 6rem;
    height: 2rem;
    border: 0;
    outline: 0;
    display: block;
    font-size: 0.875rem;
  }

  button:not(:last-of-type) {
    margin-right: 1rem;
  }
</style>

<button {disabled} aria-disabled={disabled} on:click type="button">
  <slot />
</button>
