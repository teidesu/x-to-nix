import { describe, expect, it } from 'vitest'

import { tomlToNix } from './toml'

describe('tomlToNix', () => {
    it('converts simple toml to nix', () => {
        expect(tomlToNix('foo = "bar"')).toMatchInlineSnapshot(`
          {
            "properties": [
              {
                "key": "foo",
                "value": {
                  "type": "LiteralString",
                  "value": "bar",
                },
              },
            ],
            "type": "Object",
          }
        `)
    })

    it('converts toml with array to nix', () => {
        expect(tomlToNix('foo = ["bar", "baz"]')).toMatchInlineSnapshot(`
          {
            "properties": [
              {
                "key": "foo",
                "value": {
                  "elements": [
                    {
                      "type": "LiteralString",
                      "value": "bar",
                    },
                    {
                      "type": "LiteralString",
                      "value": "baz",
                    },
                  ],
                  "type": "Array",
                },
              },
            ],
            "type": "Object",
          }
        `)
    })

    it('converts toml with nested objects to nix', () => {
        expect(tomlToNix('[foo]\nbar = "baz"')).toMatchInlineSnapshot(`
          {
            "properties": [
              {
                "key": "foo",
                "value": {
                  "properties": [
                    {
                      "key": "bar",
                      "value": {
                        "type": "LiteralString",
                        "value": "baz",
                      },
                    },
                  ],
                  "type": "Object",
                },
              },
            ],
            "type": "Object",
          }
        `)
        expect(tomlToNix('foo = { bar = "baz" }')).toMatchInlineSnapshot(`
          {
            "properties": [
              {
                "key": "foo",
                "value": {
                  "properties": [
                    {
                      "key": "bar",
                      "value": {
                        "type": "LiteralString",
                        "value": "baz",
                      },
                    },
                  ],
                  "type": "Object",
                },
              },
            ],
            "type": "Object",
          }
        `)
    })

    it('converts toml with nested arrays to nix', () => {
        expect(tomlToNix('foo = [["bar"], ["baz"]]')).toMatchInlineSnapshot(`
          {
            "properties": [
              {
                "key": "foo",
                "value": {
                  "elements": [
                    {
                      "elements": [
                        {
                          "type": "LiteralString",
                          "value": "bar",
                        },
                      ],
                      "type": "Array",
                    },
                    {
                      "elements": [
                        {
                          "type": "LiteralString",
                          "value": "baz",
                        },
                      ],
                      "type": "Array",
                    },
                  ],
                  "type": "Array",
                },
              },
            ],
            "type": "Object",
          }
        `)
    })
})
