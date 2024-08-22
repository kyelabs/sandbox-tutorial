import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import content from 'content'

let editor = new EditorView({
  extensions: basicSetup,
  parent: document.getElementById('editor')
})

console.log(content)
