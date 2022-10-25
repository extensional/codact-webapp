<script  lang="ts">
  import { EditorView,  } from '@codemirror/view';
  import { EditorState, Compartment, EditorSelection } from '@codemirror/state';

  import { onMount } from 'svelte';
  import { javascript } from '@codemirror/lang-javascript';

  import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, keymap } from '@codemirror/view';  
  import { foldGutter, bracketMatching, foldKeymap } from '@codemirror/language';
  import { defaultKeymap } from '@codemirror/commands';
  import { oneDark } from "@codemirror/theme-one-dark";
  import { allowedKeys } from "./util/allowedKeys";
  import { browser } from '$app/environment';

  export let selectionStart = 0;
  export let selectionEnd = 0;
  export let gencode : string = "";

  const editorTheme = EditorView.theme({
    "&": {
    color: "white",
    backgroundColor: "#2a2a2a"
  },
  ".cm-gutters": {
    backgroundColor: "#445",
    color: "#ddd",
    border: "none"
  }
  })

  const basicSetup = /*@__PURE__*/(() => [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    foldGutter(),
    drawSelection({ cursorBlinkRate: 0 }),
    EditorState.allowMultipleSelections.of(false),
    bracketMatching(),
    keymap.of([
        ...defaultKeymap,
        ...foldKeymap
    ]),
    editorTheme,
    oneDark
])();


  let editor: Element;
  let myView: EditorView;


  export function updateSelect() {
    const doclen = myView.state.doc.length;
    const selectrange = myView.state.selection.ranges?.at(-1);
    const range = selectrange ?? { from: doclen, to:doclen} ;
    selectionStart = range.from;
    selectionEnd = range.to;
    
    console.log('selectionStart', selectionStart);
    console.log('selectionEnd', selectionEnd);
  }
  onMount(() => {if (browser) addEventListener('mouseup', updateSelect);});

  export function updateKeyDownSelect(e: any) {
    if(allowedKeys.includes(e.key)){
      const doclen = myView.state.doc.length;
      const selectrange = myView.state.selection.ranges?.at(-1);
      const range = selectrange ?? { from: doclen, to:doclen} ;
      selectionStart = range.from;
      selectionEnd = range.to;
    }else{
      const editorElement = document.getElementsByClassName("left-column");
      editorElement[0].classList.add("illegal-key");
      setTimeout(() => editorElement[0].classList.remove("illegal-key"), 100);
    }
  }

  onMount(() => {
    let language = new Compartment();
    myView = new EditorView({
      doc: gencode,
      extensions: [basicSetup, language.of(javascript()), EditorState.readOnly.of(true)],
      parent: editor
    });

    const doclen = myView.state.doc.length;
    myView.dispatch({ selection : EditorSelection.cursor(doclen)});
    updateSelect();
  });

  $: {
    if (myView) {
      myView.dispatch({
        changes: {
          from: 0,
          to: myView.state.doc.length,
          insert: gencode
        }
      });
      const doclen = myView.state.doc.length;
      myView.dispatch({ selection : EditorSelection.cursor(doclen)});
      updateSelect(); 
    }
  }

</script>

<span
    on:keydown={updateKeyDownSelect}
    on:click={updateSelect}
    on:select={updateSelect}
    bind:this={editor}
    class="codeView"
  />
