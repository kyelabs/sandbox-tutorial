import './style.css'
import { EditorView, basicSetup } from 'codemirror'

// import content from 'content'

// Load Script into editor
window.editor = new EditorView({
  doc: content[0].models[0].code,
  extensions: basicSetup,
  parent: document.getElementById('editor'),
})

// Load Lesson Content
document.querySelector('#lesson .content').innerHTML = content[0].html