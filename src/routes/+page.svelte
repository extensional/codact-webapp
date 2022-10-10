<script lang="ts">
  import url from '$lib/url.js';
  import {startCode} from './codeGlobals.js';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import Interactions from '$lib/Interactions.svelte';
  import { canvasWrapperGenerator } from './canvasWrapperGenerator';
  import type { PageData } from './$types';
  import type { Interaction } from '@prisma/client';
  import CodeView from '$lib/CodeView.svelte';
  import { browser } from '$app/environment';
  import mixpanel from 'mixpanel-browser';

  export let data: PageData;

  let gen = $page.url.searchParams.get('gen');


  let interactions: Interaction[] = [];

  url.subscribe(() => {
    if (
      interactions.length > 0 &&
      (!$url.searchParams.get('gen') || $url.searchParams.get('gen') != interactions.at(-1)?.gen)
    )
      interactions = [];
    if (!$url || $url.search == '') gen = null;
    else gen = $url.searchParams.get('gen');

  });

  let gencode = startCode;
  let selectionStart = 0;
  let selectionEnd = 0;
  $: {
    gencode = interactions.at(-1)?.code || data.interactions?.at(-1)?.code || startCode; 
  }
   
  
  $: if (browser) { 
    try {
    mixpanel.init('705a7eef381e043f43ca111a0b4d067e', {debug: import.meta.env.DEV, ignore_dnt: true, api_host: "https://api.mixpanel.com"});
    mixpanel.track('Codact.load', {data, gen, gencode});
    } catch (e) {
      console.log("couldn't even");
    }
  }
</script>

<svelte:head>
  <title>Codact - {data.title}</title>
  <meta name="description" content="A todo list app" />
</svelte:head>

<div class="mainarea">
  <div class="left-column">
    <CodeView bind:selectionStart bind:selectionEnd bind:gencode />
  </div>
  
  <div class="right-column">
    <div class="chat" id="chatWindow">
      <div>
        <div class="history">
          <Interactions interactions={data.interactions} />
          <Interactions {interactions} />
        </div>
        <form
          id="usrform"
          class="newchat"
          action="/?gen={gen}#"
          method="POST"
          use:enhance={({ form, data, action, cancel }) => {
            mixpanel.track('Codact.push.init', {form, gen, gencode});

            return async ({ result, update }) => {
              mixpanel.track('Codact.push.result', {result, gen, gencode});

              if (!result.data) return;
    
              form.reset();
    
              gen = result.data.gen;
              const newurl = `?gen=${gen}`;
              interactions = interactions.concat(result.data);
    
              if (window.history.pushState) window.history.pushState(null, '', newurl);
              else goto(newurl);
            };
          }}
        >
          <input type="hidden" name="selectionStart" value={selectionStart.toString()} />
          <input type="hidden" name="selectionEnd" value={selectionEnd.toString()} />
          <input type="hidden" name="selection" value="" />
          >
          <input
            class="question"
            name="question"
            aria-label="ask codact a question"
            placeholder="How can I help you?"
          />
        </form>
      </div>
    </div>

    <iframe
      title="Rendered Frame"
      srcdoc={canvasWrapperGenerator(gencode)}
      class="render"
      id="render"
    />
  </div>

</div>

<style>

  .mainarea {
    width: 100%;
    /* max-width: var(--column-width); */
    /* margin: var(--column-margin-top) auto 0 auto; */
    line-height: 1;
    display:flex;
    flex-direction: row;
    height: 85vh;
  }


  input:focus-visible {
    border: none;
    outline: none;
  }

</style>
