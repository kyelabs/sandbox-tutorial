import './style.css'
import { EditorView, basicSetup } from 'codemirror'

// Load Script into editor
const $editor = document.getElementById('editor')
const code = $editor.querySelector('pre').innerText
$editor.removeChild($editor.querySelector('pre'))
const editor = new EditorView({
  doc: code,
  extensions: basicSetup,
  parent: $editor,
})

Object.defineProperty(window, 'code', {
  get() {
    return editor.state.doc.toString()
  }
})