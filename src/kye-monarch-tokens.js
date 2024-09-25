// https://microsoft.github.io/monaco-editor/monarch.html

export default {
  defaultToken: 'invalid',

  control: [
    'if','else','assert','return','operation','to','from','null',
    'in','is','and','or','not',
  ],

  builtin: [
    'TRUE','FALSE','NULL',
    'this'
  ],
  
  operators: [
    '+', '-', '*', '/', '%', '==', '!=', '>', '<', '>=', '<=', '&', '|', '!', '=',
  ],
  
  // we include these common regular expressions
  symbols:  /[=><!~?:&|+\-*\/\^%]+/,
  
  // C# style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-z_$][\w$]*/, { cases: { '@control': 'keyword.control',
                                   '@builtin': 'keyword.builtin',
                                   '@default': 'variable' } }],
      [/[A-Z_$][\w$]*/, { token: 'type.identifier' } ],

      // whitespace
      { include: '@whitespace' },

      // delimiters and operators
      [/[{}()\[\]]/, '@brackets'],
      [/@symbols/, { cases: { '@operators': 'operator',
                              '@default'  : '' } } ],
                              
      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/\d+/, 'number'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
      [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/#.*$/,    'comment'],
    ],

    format: [
      [/>/, { token: 'format', bracket: '@close', next: '@pop' }],
      [/[^<>]+/, 'format'],
    ],

    string: [
      [/[^\\"]+/,  'string'],
      [/@escapes/, 'string.escape'],
      [/\\./,      'string.escape.invalid'],
      [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
    ],

  }
}