import './style.css'
import './vscode-dark.css'
import 'codemirror/lib/codemirror.css'
import loader from '@monaco-editor/loader'
import Prism from 'prismjs'
import kyeMonarchTokens from './kye-monarch-tokens'

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

window.addEventListener('DOMContentLoaded', () => {
  const $editor = document.getElementById('editor')
  const code = $editor.querySelector('pre').innerText
  $editor.removeChild($editor.querySelector('pre'))
  loader.init().then(monaco => {
    monaco.languages.register({ id: 'kye' });
    monaco.languages.setMonarchTokensProvider('kye', kyeMonarchTokens)
    monaco.editor.create($editor, {
      value: code,
      language: 'kye',
      theme: 'vs-dark',
    })
  })
})

