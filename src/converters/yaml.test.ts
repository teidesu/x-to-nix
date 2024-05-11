import { describe, expect, it } from 'vitest'

import { yamlToNix } from './yaml'

describe('yamlToNix', () => {
    it('converts null', () => {
        expect(yamlToNix('null')).toMatchInlineSnapshot(`
          {
            "type": "LiteralNull",
          }
        `)
    })

    it('converts true', () => {
        expect(yamlToNix('true')).toMatchInlineSnapshot(`
          {
            "type": "LiteralBoolean",
            "value": true,
          }
        `)
    })

    it('converts false', () => {
        expect(yamlToNix('false')).toMatchInlineSnapshot(`
          {
            "type": "LiteralBoolean",
            "value": false,
          }
        `)
    })

    it('converts numbers', () => {
        expect(yamlToNix('42')).toMatchInlineSnapshot(`
          {
            "type": "LiteralNumber",
            "value": 42,
          }
        `)
    })

    it('converts strings', () => {
        expect(yamlToNix('hello')).toMatchInlineSnapshot(`
          {
            "type": "LiteralString",
            "value": "hello",
          }
        `)
    })

    it('converts arrays', () => {
        expect(yamlToNix('[1, 2, "3", ["4"]]')).toMatchInlineSnapshot(`
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
        expect(yamlToNix('a: b\n')).toMatchInlineSnapshot(`
          {
            "properties": [
              {
                "key": "a",
                "value": {
                  "type": "LiteralString",
                  "value": "b",
                },
              },
            ],
            "type": "Object",
          }
        `)
    })

    it('throws on unsupported types', () => {
        expect(() => yamlToNix('!!binary Zm9v')).toThrowErrorMatchingInlineSnapshot('[Error: Unsupported scalar type: object (foo)]')
    })
})
