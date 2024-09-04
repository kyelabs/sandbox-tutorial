import './style.css'
import './vscode-dark.css'
import 'codemirror/lib/codemirror.css'
import { EditorView, basicSetup } from 'codemirror'
// import { oneDark } from "@codemirror/theme-one-dark";
// import { kye } from './long-gone'
import Prism from 'prismjs'
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/addon/mode/simple'
import 'codemirror/addon/edit/matchbrackets'

Prism.languages.kye = {
  comment: {
    pattern: /#.*/,
    greedy: true,
  },
  string: Prism.languages.clike.string,
  number: Prism.languages.clike.number,
  boolean: Prism.languages.clike.boolean,
  keyword: /\b(if|else|assert|operation|to|from|null)\b/,
  builtin: /\b(this|super)\b/,
  symbol: /@([a-z]\w*\.)*[a-z]\w*/,
  constant: /\b[A-Z_]+[A-Z0-9_]*\b/,
  'class-name': /\b[A-Z]+[a-z][a-zA-Z0-9]*\b/,
  variable: /\b[a-z_]+[a-z_A-Z0-9]*\b/,
}

CodeMirror.defineSimpleMode('kye', {
  start: [
    { regex: /#.*/, token: 'comment' },
    { regex: /"(?:[^\\]|\\.)*?"/, token: 'string'},
    { regex: /(?:\d*\.\d+|\d+\.\d*|\d+)/, token: 'number' },
    { regex: /(?:if|else|assert|operation|to|from|null)\b/, token: 'keyword' },
    { regex: /\b(this|super)\b/, token: 'atom' },
    // { regex: /@([a-z]\w*\.)*[a-z]\w*/, token: 'symbol' },
    // { regex: /[A-Z_]+[A-Z0-9_]*/, token: 'variable-3' },
    { regex: /\b[A-Z]+[a-z][a-zA-Z0-9]*\b/, token: 'type' },
    { regex: /\b[a-z_]+[a-z_A-Z0-9]*\b/, token: 'property' },
  ],
})

window.addEventListener('DOMContentLoaded', () => {
  const $editor = document.getElementById('editor')
  const code = $editor.querySelector('pre').innerText
  $editor.removeChild($editor.querySelector('pre'))
  window.cm = CodeMirror($editor, {
    value: code,
    theme: 'vscode-dark',
    mode: 'kye',
    lineNumbers: true,
    lineWrapping: true,
    tabSize: 2,
    matchBrackets: true,
  })
})

