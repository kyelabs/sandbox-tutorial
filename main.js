import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import content from 'content'

window.editor = new EditorView({
  extensions: basicSetup,
  parent: document.getElementById('editor'),
})
const transaction = window.editor.state.update({changes: {from: 0, insert: content[0].models[0].code }})
window.editor.dispatch(transaction)

document.querySelector('#lesson .content').innerHTML = content[0].html
