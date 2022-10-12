<script lang="ts">	
  import url from '$lib/url.js';
  import { page } from '$app/stores';
  import { canvasWrapperGenerator } from '$lib/canvasWrapperGenerator';

  import type { PageData } from './$types';
  import { browser } from '$app/environment';

  export let data: PageData;

  let gen = $page.url.searchParams.get('gen');

  $: if (browser)
    window.mixpanel.track('forks.load', data);
  
  function showQuestion(q) {
    const len = 10;
    return q.slice(0,len).concat(data.question.length > len ? "..." : "" );
  }
</script>

<svelte:head>
  <title>Forks - {data.title}</title>
  <meta name="description" content="About codact" />
</svelte:head>

<div class="content">
  <h1><span class="title-area"><span class="title">{data.title}</span> <span class="title-gen">{gen?.slice(18) ?? ""}</span></span></h1>

  {#each data.interactions as interaction (interaction.gen)}
  <div class="interaction">
    <div class="interaction-info">
      <a href="/?gen={interaction.gen}">
        <span class="title">{interaction.title}</span>
      </a>
      <a href="/?gen={interaction.gen}">
        <span class="title-gen">{interaction.gen.slice(18)}</span>
      </a>
    </div>
    <iframe
      title="Rendered Frame"
      srcdoc={canvasWrapperGenerator(interaction.code)}
      class="small_render"
    />
    <div class="interaction-info">
      <span class="prompt">>>> </span><span class="question">{interaction.question}</span>
    </div>
    
  </div>
  {/each}
</div>

<style>  

  .interaction-info .prompt {
    color: #A2C799;
    width: 15px;
  }

  .interaction-info .question {
    color: white;
    float: right;
    text-align: left;
    width: 215px;    
  }

  .interaction-info .title {
    color: pink;
    width: 100px;
  }
  .interaction-info .title-gen {
    float:right;
    text-align: right;
    color: grey;
    width: 50px;
  }
  .interaction-info .title-gen:hover {
    text-decoration: underline;
  }

  .content {
    width: 100%;
    max-width: var(--column-width);
    margin: 0 auto 0 auto;
  }


  .interaction {
    align-items: center;
    text-align:center;
    margin-bottom: 10px;
    width: 250px;
    height: 250px;
    align-self: center;

    float: left;
    margin-left: 43px;

    margin-right: 43px;
  }

  .small_render {
    align-self: center;
    width: 250px;
    height: 150px;
  }

  .interaction-info {
    width: 100%;
    align-self: center;
    text-align: left;
  }

  .title-area {
    color: pink;
  }

  .title-area .title-gen {
    color: gray;
  }

  .title-area .title {
    color: white;
  }
</style>
