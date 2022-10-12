<script lang="ts">
  import url from '$lib/url.js';
  import { startCode } from './codeGlobals.js';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  import Interactions from '$lib/Interactions.svelte';
  import { canvasWrapperGenerator } from '$lib/canvasWrapperGenerator';
  import type { PageData } from './$types';
  import type { Interaction } from '@prisma/client';
  import CodeView from '$lib/CodeView.svelte';
  import { browser } from '$app/environment';

  export let data: PageData;

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
</script>

<svelte:window
  on:popstate={(e) => {
    invalidateAll();
    interactions = [];
  }}
/>

<svelte:head>
  <title>Codact - {data.title}</title>
  <meta name="description" content="Codact: interactive AI coding" />
</svelte:head>

<div class="gen-title">
  <span class="gen-part">{gen ? gen.slice(18).concat(' ') : ''}</span>[
  <span class="title-part" contenteditable bind:textContent={data.title} /> ]
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
            };
          }}
        >
          <input type="hidden" name="selectionStart" value={selectionStart.toString()} />
          <input type="hidden" name="selectionEnd" value={selectionEnd.toString()} />
          <input type="hidden" name="selection" value="" />
          <input type="hidden" name="title" bind:value={data.title} />
          >
          <input
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
    color: pink;
  }

  .gen-title span {
    color: lightgray;
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

  .new-link-area {
    text-align: right;
    font-size: small;
  }

  .new-link {
    height: 20px;
    color: #bbb;
    background-color: #333;
    padding: 4px;
    border-radius: 2px;
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
    border: 2px solid var(--beep-color) !important;
    border-radius: 0px;
    background-color: var(--primary-color);
    padding: 10px;
    overflow: auto;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    position: relative;
    max-width: 400px; 
  }
</style>
