import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { Grid } from 'gridjs'
import 'gridjs/dist/theme/mermaid.css'

import content from 'content'

// Load Script into editor
window.editor = new EditorView({
  doc: content[0].models[0].code,
  extensions: basicSetup,
  parent: document.getElementById('editor'),
})

// Load Lesson Content
document.querySelector('#lesson .content').innerHTML = content[0].html

// Load data into grid
const data = content[0].data[0]
new Grid({
  columns: data.columns,
  data: data.records,
  sort: true,
  style: {
    container: {
      'padding': '0px',
      'border-radius': '0px',
    },
    wrapper: {
    },
    table: {
      'font-size': '12px',
    },
    td: {
      'padding': '5px 12px',
    }
  }
}).render(document.getElementById('tables'))