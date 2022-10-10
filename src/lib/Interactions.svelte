<script>
  import { scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  export let interactions;

  function copyToClipboard() {
    
  }
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
      <div class="answer">{interaction.answer}</div>
      <div class="share-links"><span class="surroundings">
        <a class="fork-link" href="/?gen={interaction.gen}#!">revert</a> |
        <a class="fork-link" target="_blank" href="/?gen={interaction.gen}#!">fork</a> |
        <a class="fork-link" href="" onclick="navigator.clipboard.writeText(`https://codact.dev/?gen={interaction.gen}`)">permalink</a>
        </span>
      </div>
    </div>
  </div>
{/each}
{/key}

<style>
  .share-links {
    padding-top: 1px;
    padding-right: 0px;
    color: #bbb;
    font-size: x-small;
    text-align: right;
    margin-bottom: 5px;   

  }

  .answer {
    margin-left: 14px;
    margin-bottom: 5px;
    font-size : smaller;
    line-height: 16px;
  }

  .fork-link{
    color: #bbb;
  }

  .interaction{
    display:flex;
    flex-direction: column;
  }

  .interaction-chat.ai-answer {
    align-items: start;
    padding-top: 5px;
    width: 100%;    
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