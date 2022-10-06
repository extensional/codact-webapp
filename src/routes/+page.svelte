<script>
    import { dataset_dev } from 'svelte/internal';


  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  import Interactions from '$lib/Interactions.svelte';

  import CodeMirror from 'svelte-codemirror-editor';
  import { javascript } from '@codemirror/lang-javascript';

  /** @type {import('./$types').PageData} */
  export let data;

  let gen = $page.url.searchParams.get('gen');

  let selected = '';

  // @ts-ignore
  let interactions = [];

  let gencode = "";
  let codeview;

  // @ts-ignore
  export function updateSelect(e) {
    selected = window.getSelection()?.toString() ?? '';
    console.log('Selected:', selected);
  }
</script>

<svelte:head>
  <title>Codact {data.title}</title>
  <meta name="description" content="A todo list app" />
</svelte:head>

<div class="todos">
  <h1>Codact Generative Coding</h1>

  <dev on:click={updateSelect} on:select={updateSelect}>
    <CodeMirror
      bind:this={codeview}
      class="codeView"
      lang={javascript()}
      value={interactions.at(-1)?.code || data.interactions.at(-1)?.code}
      readonly={true}
    />
  </dev>

  <iframe srcdoc= "
    <html>
    <head>
      <script>
        {data.interactions.at(-1)?.code}
      </script>
    </head>

    <body>
      <canvas></canvas>
    </body>
    </html>" class="render"/>

  <div class="chat">
    <div class="history">

      <Interactions interactions={data.interactions}/>
      <Interactions interactions={interactions}/>
    </div>

    <form
      id="usrform"
      class="newchat"
      action="/?gen={gen}"
      method="POST"
      use:enhance={({ form, data, action, cancel }) => {
        return async ({ result, update }) => {
          if (!result.data) 
            return;

          form.reset();

          gen = result.data.gen;
          const newurl = `?gen=${gen}`;
          interactions = interactions.concat(result.data);

          if (window.history.pushState) 
            window.history.pushState(null, '', newurl);
          else 
            goto(newurl);
        };
      }}
    >
      <input type="hidden" name="selection" value={selected} />
      <input
        name="question"
        aria-label="ask codact a question"
        placeholder="codact> How can I help you?"
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

  .todos {
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

  input {
    border: 1px solid transparent;
  }

  input:focus-visible {
    box-shadow: inset 1px 1px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #ff3e00 !important;
    outline: none;
  }

  .newchat input {
    font-size: 28px;
    width: 100%;
    padding: 0.5em 1em 0.3em 1em;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    text-align: center;
  }

  .todo {
    display: grid;
    grid-template-columns: 2rem 1fr 2rem;
    grid-gap: 0.5rem;
    align-items: center;
    margin: 0 0 0.5rem 0;
    padding: 0.5rem;
    background-color: white;
    border-radius: 8px;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
    transform: translate(-1px, -1px);
    transition: filter 0.05s, transform 0.05s;
  }

  .done {
    transform: none;
    opacity: 0.4;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.1));
  }

  form.question {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
  }

  .interaction input {
    flex: 1;
    padding: 0.5em 2em 0.5em 0.8em;
    border-radius: 3px;
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
