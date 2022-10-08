<script  lang="ts">
  import { EditorView, Decoration, WidgetType, type DecorationSet, keymap } from '@codemirror/view';
  import { basicSetup } from 'codemirror';
  import { EditorState, Compartment, StateField, StateEffect, SelectionRange, EditorSelection, type ChangeSpec } from '@codemirror/state';

  import { onMount } from 'svelte';


  import { javascript } from '@codemirror/lang-javascript';

  export let selectionStart = 0;
  export let selectionEnd = 0;
  export let gencode : string = "";

  let editor: Element;

  let myView: EditorView;
  class CursorWidget extends WidgetType {
    constructor() {
      super();
    }

    eq(other: CursorWidget) {
      return true;
    }

    toDOM() {
      const cursorElement = document.createElement('span');
      cursorElement.style.borderLeftStyle = 'solid';
      cursorElement.style.borderLeftWidth = '2px';
      cursorElement.style.borderLeftColor = '#ff0000';
      cursorElement.style.height = `10px`;
      cursorElement.style.padding = '0';
      cursorElement.style.zIndex = '0';
      return cursorElement;
    }

    ignoreEvent() {
      return false;
    }
  }

  const cursor = Decoration.widget({
    widget: new CursorWidget()
  });

  const addUnderline = StateEffect.define<{ from: number; to: number }>({
    map: ({ from, to }, change) => ({ from: change.mapPos(from), to: change.mapPos(to) })
  });

  const underlineField = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(underlines, tr) {
      underlines = Decoration.none; //underlines.map(tr.changes);
      for (let e of tr.effects)
        if (e.is(addUnderline)) {
          underlines = underlines.update({
            add: [cursor.range(e.value.from, e.value.from)]
          });
        }
      return underlines;
    },
    provide: (f) => EditorView.decorations.from(f)
  });

  function underlineSelection(view: EditorView) {
    let effects: StateEffect<unknown>[] = view.state.selection.ranges.map(({ from, to }) =>
      addUnderline.of({ from, to })
    );
    if (!effects.length) return false;

    if (!view.state.field(underlineField, false))
      effects.push(StateEffect.appendConfig.of([underlineField]));
    view.dispatch({ effects });
    return true;
  }

  export function updateSelect() {
    
    const doclen = myView.state.doc.length;
    const selectrange = myView.state.selection.ranges?.at(-1);
    const range = selectrange ?? { from: doclen, to:doclen} ;
    selectionStart = range.from;
    selectionEnd = range.to;
    underlineSelection(myView);
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

<dev
    on:keydown={updateSelect}
    on:click={updateSelect}
    on:select={updateSelect}
    bind:this={editor}
  />