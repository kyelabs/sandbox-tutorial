import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import './style.css'
import loader from '@monaco-editor/loader'
import Prism from 'prismjs'
import kyeMonarchTokens from './kye-monarch-tokens'

import { ModuleRegistry, createGrid } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

import pyWorker from "./py-worker";

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

window.addEventListener('DOMContentLoaded', async () => {
  const $editor = document.getElementById('editor')
  const code = $editor.querySelector('pre').innerText
  $editor.removeChild($editor.querySelector('pre'))
  const monaco = await loader.init()
  monaco.languages.register({ id: 'kye' });
  monaco.languages.setMonarchTokensProvider('kye', kyeMonarchTokens)
  window.editor = monaco.editor.create($editor, {
    value: code,
    language: 'kye',
    theme: 'vs-dark',
    minimap: { enabled: false },
  })

  const tableData = window.DATA[0]
  const tableContext = {errors:[]}
  window.grid = createGrid(document.getElementById('tables'), {
    context: tableContext,
    defaultColDef: {
      editable: true,
      cellEditor: 'agTextCellEditor',
      flex: 1,
      cellClassRules: {
        'cell-error': (params) => {
          if (params.context.errors.length === 0) return false
          return params.context.errors.some(error => {
            const appliesToRow = error.rows.length == 0 || error.rows.includes(params.node.rowIndex)
            const appliesToCol = error.edges.length == 0 || error.edges.includes(params.colDef.field)
            return appliesToRow && appliesToCol
          })
        },
      }
    },
    columnDefs: tableData.columns.map(field => ({ field })),
    rowData: tableData.rows.map(row => row.reduce((acc, value, i) => ({ ...acc, [tableData.columns[i]]: value }), {})),
  });

  const getTableData = () => {    
    const rows = []
    window.grid.forEachNode(node => rows.push(node.data));
    return rows
  }

  const $run = document.getElementById('run')
  let first_run = true
  $run.onclick = async () => {
    $run.setAttribute('disabled', true)
    if (!first_run) { $run.innerText = 'Running...' }
    first_run = false
    const errors = await pyWorker.run(
      editor.getValue(),
      getTableData(),
      tableData.name,
    )
    $run.removeAttribute('disabled')
    $run.innerText = 'Run'
    tableContext.errors = errors
    window.grid.refreshCells()
    console.log('errors:', errors)
  }
  $run.onclick()
})

