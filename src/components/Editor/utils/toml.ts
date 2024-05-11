// from https://github.com/ffflabs/toml-editor/blob/7016f1d6e03a1248e4dc6ee374c72693813f61d9/src/Editor/languages/toml.ts
import type monaco from 'monaco-editor'

type IRichLanguageConfiguration = monaco.languages.LanguageConfiguration
type ILanguage = monaco.languages.IMonarchLanguage

export const conf: IRichLanguageConfiguration = {
    comments: {
        lineComment: '#',
    },
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
}

export const language = <ILanguage>{
    defaultToken: '',
    tokenPostfix: '.toml',

    // we include these common regular expressions
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // The main tokenizer for our languages
    tokenizer: {
        root: [
            { include: '@comments' },
            { include: '@tables' },
            { include: '@keys' },

            // whitespace
            { include: '@whitespace' },

            { include: '@dateTimeWithTz' },
            { include: '@dateTime' },
            { include: '@date' },
            { include: '@float' },
            { include: '@integer' },
            { include: '@boolean' },
            { include: '@string' },
        ],

        boolean: [[/(?<!\w)(true|false)(?!\w)/, 'constant.other.boolean.toml']],

        comments: [
            [
                /\s*((#).*)$/,
                {
                    cases: {
                        $1: 'comment.line.number-sign.toml',
                        $2: 'punctuation.definition.comment.toml',
                    },
                },
            ],
        ],

        dateTimeWithTz: [
            [
                /(?<!\w)(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))(?!\w)/,
                'constant.other.datetime-with-timezone.toml',
            ],
        ],

        dateTime: [
            [
                /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?)/,
                'constant.other.datatime.toml',
            ],
        ],

        date: [[/(\d{4}-\d{2}-\d{2})/, 'constant.other.date.toml']],

        float: [
            [
                /(?<!\w)([+-]?(0|([1-9](([0-9]|_[0-9])+)?))(?:(?:\.(0|([1-9](([0-9]|_[0-9])+)?)))?[eE][+-]?[1-9]_?[0-9]*|(?:\.[0-9_]*)))(?!\w)/,
                'constant.numeric.float.toml',
            ],
        ],

        integer: [
            [
                /(?<!\w)((?:[+-]?(0|([1-9](([0-9]|_[0-9])+)?))))(?!\w)/,
                'constant.numeric.integer.toml',
            ],
        ],

        keys: [[/(^\w+)(\s*)(=)/, ['key', '', 'delimiter']]],

        whitespace: [[/[ \t\r\n]+/, '']],

        string: [
            [/[^\\"']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [
                /["']/,
                {
                    cases: {
                        '$#==$S2': { token: 'string', next: '@pop' },
                        '@default': 'string',
                    },
                },
            ],
        ],

        tables: [[/^\[\\[^\]]*\]/, 'punctuation.definition.table.toml']],
    },
}
