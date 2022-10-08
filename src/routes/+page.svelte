<script lang="ts">
  import url from '$lib/url.js';

  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  import Interactions from '$lib/Interactions.svelte';
  import { canvasWrapperGenerator } from './canvasWrapperGenerator';

  import type { PageData } from './$types';
  import type { Interaction } from '@prisma/client';
  import CodeView from '$lib/CodeView.svelte';

  export let data: PageData;

  let gen = $page.url.searchParams.get('gen');

  let selected = '';

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

  let gencode = '';
  let selectionStart = 0;
  let selectionEnd = 0;

  $: {
    gencode = interactions.at(-1)?.code || data.interactions?.at(-1)?.code || '';
  }
</script>

<svelte:head>
  <title>Codact - {data.title}</title>
  <meta name="description" content="A todo list app" />
</svelte:head>

<div class="mainarea">
  <h1>Codact Generative Coding</h1>

  <div class="codeRender">
    <CodeView bind:selectionStart bind:selectionEnd bind:gencode />

    <iframe
      title="Rendered Frame"
      srcdoc={canvasWrapperGenerator(data.interactions.at(-1)?.code ?? '')}
      class="render"
    />
  </div>

  <div class="chat">
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
        return async ({ result, update }) => {
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

<style>
  .codeView {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
    line-height: 1;
    border: 1px solid #ff3e00 !important;
  }

  .mainarea {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
    line-height: 1;
  }

  .chat {
    border: 1px solid #555555 !important;
  }

  .newchat {
    margin: 0 0 0.5rem 0;
  }

  .newchat input {
    padding: 1em 0em 0em 0em;
    width: 90%;
    border: none;
    background: rgba(255, 255, 255, 0);
  }

  input:focus-visible {
    border: none;
    outline: none;
  }

  .done {
    transform: none;
    opacity: 0.4;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.1));
  }

  .interaction input {
    flex: 1;
    padding: 0.5em 2em 0.5em 0.8em;
    border-radius: 3px;
  }

  form.question {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
  }

  button.toggle {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    box-sizing: border-box;
    background-size: 1em auto;
  }

  .done .toggle {
    background-image: url("data:image/svg+xml,%3Csvg width='22' height='16' viewBox='0 0 22 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.5 1.5L7.4375 14.5L1.5 8.5909' stroke='%23676778' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }

  .delete {
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.5 5V22H19.5V5H4.5Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M10 10V16.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 10V16.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M2 5H22' stroke='%23676778' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8 5L9.6445 2H14.3885L16 5H8Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
    opacity: 0.2;
  }

  .delete:hover,
  .delete:focus {
    transition: opacity 0.2s;
    opacity: 1;
  }

  .save {
    position: absolute;
    right: 0;
    opacity: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.5 2H3.5C2.67158 2 2 2.67157 2 3.5V20.5C2 21.3284 2.67158 22 3.5 22H20.5C21.3284 22 22 21.3284 22 20.5V3.5C22 2.67157 21.3284 2 20.5 2Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M17 2V11H7.5V2H17Z' fill='white' stroke='white' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M13.5 5.5V7.5' stroke='%23676778' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M5.99844 2H18.4992' stroke='%23676778' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E%0A");
  }
</style>
