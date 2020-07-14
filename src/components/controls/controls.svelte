<script>
  import Button from "./button.svelte";
  import PlayIcon from "../../svg/play.svg";
  import PauseIcon from "../../svg/pause.svg";
  import BackwardIcon from "../../svg/step-backward.svg";
  import ForwardIcon from "../../svg/skip-forward.svg";

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
    padding: 0.625rem 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.925);
    border-top: 1px solid #f1f1f1;
  }

  .controls__container {
    max-width: 48rem;
    width: calc(100% - 2rem);
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<section class="controls">
  <div class="controls__container">
    <Button
      label="Backward"
      {disabled}
      icon={BackwardIcon}
      on:click={onBackward} />

    <Button
      primary
      {disabled}
      label={playing ? 'Pause' : 'Play'}
      icon={playing ? PauseIcon : PlayIcon}
      on:click={onPlayToggle} />

    <Button
      {disabled}
      icon={ForwardIcon}
      on:click={onForward}
      label="Forward" />
  </div>
</section>
