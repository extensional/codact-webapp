<script lang="ts">	
  import url from '$lib/url.js';
  import { page } from '$app/stores';
  import { canvasWrapperGenerator } from '$lib/canvasWrapperGenerator';

  import type { PageData } from './$types';
  import { browser } from '$app/environment';
  
  export let data: PageData;

  let gen = $page.url.searchParams.get('showcase') ? "" : $page.url.searchParams.get('gen');

  $: if (browser)
    window.mixpanel.track('forks.load', data);
  
  function showQuestion(q) {
    const len = 10;
    return q.slice(0,len).concat(data.question.length > len ? "..." : "" );
  }
</script>

<svelte:head>
  <title>Forks - {data.title}</title>
  <meta name="description" content="ltspk showcase" />
</svelte:head>

<div class="content">
  <h1><span class="title-area"><span class="title">{data.title}</span></span></h1>
  <div class="interactions-display">

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
      
    </div>
    {/each}
  </div>
</div>

<style>  

  .interaction-info .title {
    color: var(--secondary-color);;
    width: 100px;
  }
  .interaction-info .title-gen {
    float:right;
    text-align: right;
    color: var(--tertiary-color);
    width: 50px;
  }
  .interaction-info .title-gen:hover {
    text-decoration: underline;
  }

  .content {
    width: 100%;
    align-items: center;
    max-width: var(--column-width);
    margin: 0 auto 0 auto;
  }

  .interactions-display{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }


  .interaction {
    margin-bottom: 10px;
    margin-left: 43px;
    margin-right: 43px;
    flex: 1;
  }

  .small_render {
    align-self: center;
    width:100%;
    min-width: 250px;
    height: 200px
  }

  .interaction-info {
    width: 100%;
    align-self: center;
    text-align: left;
  }

  .title-area {
    color: var(--secondary-color);
  }
  
  .title-area .title {
    color: var(--primary-color);
  }
</style>
