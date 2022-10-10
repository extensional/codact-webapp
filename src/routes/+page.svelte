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

  .mainarea {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
    line-height: 1;
  }


  input:focus-visible {
    border: none;
    outline: none;
  }

</style>
