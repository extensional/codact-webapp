<script lang="ts">
  import url from '$lib/url.js';

  import { onMount } from 'svelte';
  import { startCode } from './codeGlobals.js';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  import Interactions from '$lib/Interactions.svelte';
  import { canvasWrapperGenerator } from '$lib/canvasWrapperGenerator';
  import type { PageData } from './$types';
  import type { Interaction } from '@prisma/client';
  import CodeView from '$lib/CodeView.svelte';
  import { dev, browser } from '$app/environment';

  export let data: PageData;

  async function apiCall(call, body) {
    const response = await fetch(`/api/` + call, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return await response.json();
  }

  /*let gen = null;
	$: if ($url || $page.url) {
    console.log("URL:", $url);
		gen = ($url ? $url : $page.url).searchParams.get('gen');
  }*/

  let gen = $page.url.searchParams.get('gen');

  let interactions: Interaction[] = [];
  /*
  $: if ( !gen || gen != interactions.at(-1)?.gen)
    interactions = [];
  */

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
  let isLoading = false;

  $: {
    gencode = interactions.at(-1)?.code || data.interactions?.at(-1)?.code || startCode;
  }

  $: if (browser) {
    window.mixpanel.track('Codact.load', { data, gen, gencode });
  }
  let question = '';

  function newUpdateTitle() {
    if (!gen || data.title != 'untitled') return;
    apiCall('autoUpdateTitle.json', {
      gen: gen,
      code: gencode
    }).then(({ title }) => {
      data.title = title;
    });
  }

  function updateTitle(e) {
    if (!gen || e.key != 'Enter') return;
    apiCall('updateTitle.json', {
      gen: gen,
      title: data.title
    });
    e.preventDefault();
    document.getElementById("question")?.focus();
  }
  let highlight_checked = data.highlight;
  function updateSpecial(e) {
    if (!gen) return;    
    apiCall('updateSpecial.json', {
      gen: gen,
      highlight: !highlight_checked
    });
  }
  onMount(newUpdateTitle);
</script>

<svelte:window
  on:popstate={(e) => {
    invalidateAll();
    interactions = [];
  }}
/>

<svelte:head>
  <title>LTSPK - {data.title}</title>
  <meta name="description" content="LeetSpeak: Exploring AGI" />
</svelte:head>

<div class="gen-title">
  {#if (dev)}
    highlight: 
    <input input type="checkbox" class="highlight-checkbox" on:change={updateSpecial} bind:checked={highlight_checked} />
  {/if}

  use context: 
  <input input type="checkbox" class="useContext-checkbox" bind:checked={data.useContext} />
  <!-- <span class="gen-part">{gen ? gen.slice(18).concat(' ') : ''}</span>-->[ 
  <span
    class="title-part"
    contenteditable
    bind:textContent={data.title}
    on:keypress={updateTitle}
  />
  ]
</div>

<div class="mainarea">
  <div class="left-column">
    <CodeView bind:selectionStart bind:selectionEnd bind:gencode />
  </div>
  <div class="right-column">
    <div class="chat" id="chatWindow">
      <div>
        <div class="history">
          <Interactions bind:gen bind:interactions={data.interactions} />
          <Interactions bind:gen bind:interactions />
        </div>
        <form
          id="usrform"
          class="newchat"
          action="/?gen={gen}#"
          method="POST"
          use:enhance={({ form, data, action, cancel }) => {
            window.mixpanel.track('Codact.push.init', { form, gen, gencode });
            isLoading = true;
            console.log(data);
            return async ({ result, update }) => {
              window.mixpanel.track('Codact.push.result', { result, gen, gencode });
              isLoading = false;
              if (!result.data) return;

              form.reset();
              question = '';
              gen = result.data.gen;
              const newurl = `?gen=${gen}`;
              interactions = interactions.concat(result.data);

              if (window.history.pushState) window.history.pushState(null, '', newurl);
              else goto(newurl);

              newUpdateTitle();
            };
          }}
        >
          <input type="hidden" name="selectionStart" value={selectionStart.toString()} />
          <input type="hidden" name="selectionEnd" value={selectionEnd.toString()} />
          <input type="hidden" name="selection" value="" />
          <input type="hidden" name="title" bind:value={data.title} />
          <input type="hidden" name="useContext" bind:value={data.useContext} />
          >
          <input
            id="question"
            class={isLoading ? 'question uneditable' : 'question'}
            name="question"
            aria-label="ask codact a question"
            placeholder="How can I help you?"
            readonly={isLoading}
            bind:value={question}
          />
        </form>
      </div>
    </div>
    {#if isLoading}
      <div class="loading-animation">
        <div class="wave" />
      </div>
    {/if}

    <iframe
      title="Rendered Frame"
      srcdoc={canvasWrapperGenerator(gencode)}
      class="render"
      id="render"
    />
  </div>
</div>

<style>
  .gen-title {
    font-size: small;
    margin-top: -20px;
    margin-bottom: 2px;
    padding-right: 2px;
    align-self: end;
    text-align: right;
    width: 400px;
    color: var(--tertiary-color);
  }

  .gen-title span {
    color: var(--secondary-color);
  }

  .gen-title span.title-part:focus-visible {
    border: none;
    outline: none;
    caret-color: white;
    color: gray;
  }

  .newchat {
    margin: 0 0 0.5rem 0;
    color: var(--beep-color);
  }

  .newchat input.question {
    padding: 1em 0em 0em 0em;
    width: 90%;
    border: none;
    color: white;
    background: rgba(255, 255, 255, 0);
  }


  .mainarea {
    width: 100%;
    /* max-width: var(--column-width); */
    /* margin: var(--column-margin-top) auto 0 auto; */
    line-height: 1;
    display: flex;
    flex-direction: row;
    height: 85vh;
  }
  
  .uneditable {
    color: #a2c799;
  }

  input:focus-visible {
    border: none;
    outline: none;
  }

  .chat {
    border: 2px inset var(--beep-color) !important;
    border-radius: 0px;
    background-color: var(--primary-color);
    padding: 10px;
    overflow: auto;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    position: relative;
  }

  .right-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-left: 5px;
    max-width: 400px;
  }

  .left-column {
    flex: 1;
    overflow: auto;
    border-radius: 0px;
    margin-right: 5px;
    border: var(--beep-color) 2px inset;
  }


.render {
  height: 99%;
  margin-top: 10px;
  float: right;
  border: var(--beep-color) 2px inset;
  border-radius: 0px;
  background-color: white;
}

  @media (max-width: 720px){
    .mainarea{
      flex-direction: column;
    }
    .right-column {
      width: 100%;
      margin-left: 0;
      max-width: none;
    }
    .left-column{
      margin-right: 0;
      margin-bottom: 10px;
    }
  }
</style>
