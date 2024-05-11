import { describe, expect, it } from 'vitest'

import { jsonToNix } from './json'

describe('jsonToNix', () => {
    it('converts null', () => {
        expect(jsonToNix('null')).toMatchInlineSnapshot(`
          {
            "type": "LiteralNull",
          }
        `)
    })

    it('converts true', () => {
        expect(jsonToNix('true')).toMatchInlineSnapshot(`
          {
            "type": "LiteralBoolean",
            "value": true,
          }
        `)
    })

    it('converts false', () => {
        expect(jsonToNix('false')).toMatchInlineSnapshot(`
          {
            "type": "LiteralBoolean",
            "value": false,
          }
        `)
    })

    it('converts numbers', () => {
        expect(jsonToNix('42')).toMatchInlineSnapshot(`
          {
            "type": "LiteralNumber",
            "value": 42,
          }
        `)
    })

    it('converts strings', () => {
        expect(jsonToNix('"hello"')).toMatchInlineSnapshot(`
          {
            "type": "LiteralString",
            "value": "hello",
          }
        `)
    })

    it('converts arrays', () => {
        expect(jsonToNix('[1, 2, "3", ["4"]]')).toMatchInlineSnapshot(`
          {
            "elements": [
              {
                "type": "LiteralNumber",
                "value": 1,
              },
              {
                "type": "LiteralNumber",
                "value": 2,
              },
              {
                "type": "LiteralString",
                "value": "3",
              },
              {
                "elements": [
                  {
                    "type": "LiteralString",
                    "value": "4",
                  },
                ],
                "type": "Array",
              },
            ],
            "type": "Array",
          }
        `)
    })

    it('converts objects', () => {
        expect(jsonToNix('{"hello": "world"}')).toMatchInlineSnapshot(`
          {
            "properties": [
              {
                "key": "hello",
                "value": {
                  "type": "LiteralString",
                  "value": "world",
                },
              },
            ],
            "type": "Object",
          }
        `)
    })
})
