import { describe, expect, it } from 'vitest'

import { printNix } from './nix'

describe('printNix', () => {
    it('prints null', () => {
        expect(printNix({ type: 'LiteralNull' })).toBe('null')
    })

    it('prints true', () => {
        expect(printNix({ type: 'LiteralBoolean', value: true })).toBe('true')
    })

    it('prints false', () => {
        expect(printNix({ type: 'LiteralBoolean', value: false })).toBe('false')
    })

    it('prints numbers', () => {
        expect(printNix({ type: 'LiteralNumber', value: 42 })).toBe('42')
    })

    it('prints strings', () => {
        expect(printNix({ type: 'LiteralString', value: 'hello' })).toBe('"hello"')
    })

    it('prints multiline strings', () => {
        expect(printNix({ type: 'LiteralString', value: 'hello\nworld' })).toMatchInlineSnapshot(`
          "''
            hello
            world''"
        `)
        expect(printNix({ type: 'LiteralString', value: 'hello\nworld\n' })).toMatchInlineSnapshot(`
          "''
            hello
            world
          ''"
        `)
    })

    it('prints arrays', () => {
        expect(printNix({
            type: 'Array',
            elements: [
                { type: 'LiteralNumber', value: 1 },
                { type: 'LiteralNumber', value: 2 },
                { type: 'LiteralString', value: '3' },
                {
                    type: 'Array',
                    elements: [{ type: 'LiteralString', value: '4' }],
                },
            ],
        })).toMatchInlineSnapshot('"[ 1 2 "3" [ "4" ] ]"')
    })

    it('prints multiline arrays', () => {
        expect(printNix({
            type: 'Array',
            elements: [
                { type: 'LiteralNumber', value: 1 },
                { type: 'LiteralNumber', value: 2 },
                { type: 'LiteralString', value: '3' },
                {
                    type: 'Array',
                    elements: [{ type: 'LiteralString', value: 'very very long string very very long string very very long string' }],
                },
                {
                    type: 'Array',
                    elements: [
                        { type: 'LiteralString', value: '5' },
                        { type: 'LiteralString', value: '6' },
                    ],
                },
            ],
        })).toMatchInlineSnapshot(`
          "[
            1
            2
            "3"
            [
              "very very long string very very long string very very long string"
            ]
            [ "5" "6" ]
          ]"
        `)
    })

    it('prints objects', () => {
        expect(printNix({
            type: 'Object',
            properties: [
                {
                    key: 'hello',
                    value: { type: 'LiteralString', value: 'world' },
                },
            ],
        })).toMatchInlineSnapshot('"{ hello = "world"; }"')
        expect(printNix({
            type: 'Object',
            properties: [
                {
                    key: 'hello.world',
                    value: { type: 'LiteralString', value: 'world' },
                },
            ],
        })).toMatchInlineSnapshot('"{ "hello.world" = "world"; }"')
        expect(printNix({
            type: 'Object',
            properties: [
                {
                    key: '123',
                    value: { type: 'LiteralString', value: 'world' },
                },
            ],
        })).toMatchInlineSnapshot('"{ "123" = "world"; }"')
    })

    it('prints complex objects', () => {
        expect(printNix({
            type: 'Object',
            properties: [
                {
                    key: 'hello',
                    value: { type: 'LiteralString', value: 'world' },
                },
                {
                    key: 'foo',
                    value: {
                        type: 'Array',
                        elements: [
                            { type: 'LiteralNumber', value: 1 },
                            { type: 'LiteralNumber', value: 2 },
                        ],
                    },
                },
                {
                    key: 'bar',
                    value: {
                        type: 'Object',
                        properties: [
                            {
                                key: 'baz',
                                value: { type: 'LiteralString', value: 'qux' },
                            },
                        ],
                    },
                },
            ],
        })).toMatchInlineSnapshot(`
          "{
            hello = "world";
            foo = [ 1 2 ];
            bar = { baz = "qux"; };
          }"
        `)
    })
})
