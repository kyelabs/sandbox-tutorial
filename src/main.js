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
  monaco.editor.onDidCreateModel((model) => {
    window.editor = model
  })
  monaco.editor.create($editor, {
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
          const errors = params.context.errors.filter(error => 'rows' in error)
          if (errors.length === 0) return false
          return errors.some(error => {
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
      window.editor.getValue(),
      getTableData(),
      tableData.name,
    )
    $run.removeAttribute('disabled')
    $run.innerText = 'Run'
    tableContext.errors = errors
    window.grid.refreshCells()
    console.log('errors:', errors)

    let sum = 0;
    const lineEnds = window.editor.getValue().split('\n').map(n => sum += n.length)

    monaco.editor.setModelMarkers(window.editor, 'kye', errors.map(err => {
      if (err.msg) {
        const start = editor.getPositionAt(err.start)
        const end = editor.getPositionAt(err.end)
        return {
          startLineNumber: start.lineNumber,
          startColumn: start.column,
          endLineNumber: end.lineNumber,
          endColumn: end.column,
          message: err.msg,
          severity: monaco.MarkerSeverity.Error
        }
      } else if (err.loc) {
        const [line, col] = err.loc.split(':').map(Number)
        return {
          startLineNumber: line,
          startColumn: col,
          endLineNumber: line,
          endColumn: lineEnds[line],
          message: err.err,
          severity: monaco.MarkerSeverity.Error
        }
      } else {
        console.error('Error with no location:', err)
        return
      }
    }).filter(n => n))
  }
  $run.onclick()
})

