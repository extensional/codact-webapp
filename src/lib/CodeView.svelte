<script  lang="ts">
  import { EditorView, Decoration, WidgetType, type DecorationSet } from '@codemirror/view';
  import { EditorState, Compartment, StateField, StateEffect, EditorSelection } from '@codemirror/state';

  import { onMount } from 'svelte';
  import { javascript } from '@codemirror/lang-javascript';

  import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, keymap } from '@codemirror/view';  
  import { foldGutter, syntaxHighlighting, HighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language';
  import { defaultKeymap } from '@codemirror/commands';
  import { oneDark } from "@codemirror/theme-one-dark"  

  export let selectionStart = 0;
  export let selectionEnd = 0;
  export let gencode : string = "";

  const editorTheme = EditorView.theme({
    "&": {
    color: "white",
    backgroundColor: "#034"
  },
  ".cm-content": {
    caretColor: "#0e9"
  },
  // "&.cm-focused .cm-cursor": {
  //   borderLeftColor: "#0e9"
  // },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "#074"
  },
  ".cm-gutters": {
    backgroundColor: "#045",
    color: "#ddd",
    border: "none"
  }
  }, {dark: true})

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
    on:keydown={updateSelect}
    on:click={updateSelect}
    on:select={updateSelect}
    bind:this={editor}
    class="codeView"
  />
