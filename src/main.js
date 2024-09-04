import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import './style.css'
import loader from '@monaco-editor/loader'
import Prism from 'prismjs'
import kyeMonarchTokens from './kye-monarch-tokens'

import { ModuleRegistry, createGrid } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

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
      minimap: { enabled: false },
    })
  })

  const tableData = window.DATA[0]
  createGrid(document.getElementById('tables'), {
    defaultColDef: {
      editable: true,
      cellEditor: 'agTextCellEditor',
      flex: 1,
    },
    columnDefs: tableData.columns.map(field => ({ field })),
    rowData: tableData.rows.map(row => row.reduce((acc, value, i) => ({ ...acc, [tableData.columns[i]]: value }), {})),
  });
})

