import './style.css'
import { EditorView, basicSetup } from 'codemirror'

// Load Script into editor
const $editor = document.getElementById('editor')
const code = $editor.innerText
$editor.innerHTML = ''
window.editor = new EditorView({
  doc: code,
  extensions: basicSetup,
  parent: $editor,
})