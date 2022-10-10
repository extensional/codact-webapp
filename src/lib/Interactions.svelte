<script>
  import { scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import forkSvg from "$lib/assets/fork.svg"
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
    <div class="interaction-chat user-question">
       > {interaction.question}
    </div>
    <div class="interaction-chat ai-answer">
      <a class="fork-link" href="/?gen={interaction.gen}#!"><img class="fork-icon" src={forkSvg}/></a>
      {interaction.answer}
      <span class="tool-tip-text">Click here to fork at this point</span>
    </div>
  </div>
{/each}
{/key}

<style>
  .fork-link{
    background-color: #B59FD8;
    border-radius: 5px;
    margin-right: 40px;
  }
  .interaction{
    display:flex;
    flex-direction: column;
  }
  .interaction-chat{
    padding:10px 15px;
    width: fit-content;
    display:flex;
    align-items: start;
    margin: 5px 0 ;
    max-width:75%;
  }
  .user-question{
    color: #A2C799;
    
  }
  .ai-answer{
    color: #B59FD8;
    /* align-self: flex-end; */
  }

  



/* Tooltip text */
.tool-tip-text {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
  left: 105%;
}

/* Show the tooltip text when you mouse over the tooltip container */
.ai-answer:hover .tool-tip-text {
  visibility: visible;
}
</style>