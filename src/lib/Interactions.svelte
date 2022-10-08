<script>
  import { scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  export let interactions;
</script>

{#key interactions}
{#each interactions as interaction (interaction.gen)}  
  <div
    class="interaction"
    class:done={interaction.done}
    transition:scale|local={{ start: 0.1 }}
    animate:flip={{ duration: 50 }}
  >
    <p>> {interaction.question}</p>
    <p>{interaction.answer}</p>
    <a data-sveltekit-prefetch href="/?gen={interaction.gen}#!">fork@{interaction.gen}</a>
  </div>
{/each}
{/key}
