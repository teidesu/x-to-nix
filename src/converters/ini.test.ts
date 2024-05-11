import { describe, expect, it } from 'vitest'

import { iniToNix } from './ini'

describe('iniToNix', () => {
    it('converts simple ini to nix', () => {
        expect(iniToNix('[foo]\nbar = baz')).toMatchInlineSnapshot(`
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

    it('converts ini with multiple sections to nix', () => {
        expect(iniToNix('[foo]\nbar = baz\n[qux]\nquux = corge')).toMatchInlineSnapshot(`
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
              {
                "key": "qux",
                "value": {
                  "properties": [
                    {
                      "key": "quux",
                      "value": {
                        "type": "LiteralString",
                        "value": "corge",
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

    it('converts ini with global section to nix', () => {
        expect(iniToNix('foo = bar\n[qux]\nquux = corge')).toMatchInlineSnapshot(`
          {
            "properties": [
              {
                "key": "globalSection",
                "value": {
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
                },
              },
              {
                "key": "sections",
                "value": {
                  "properties": [
                    {
                      "key": "qux",
                      "value": {
                        "properties": [
                          {
                            "key": "quux",
                            "value": {
                              "type": "LiteralString",
                              "value": "corge",
                            },
                          },
                        ],
                        "type": "Object",
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

    it('converts ini with only global section to nix', () => {
        expect(iniToNix('foo = bar')).toMatchInlineSnapshot(`
          {
            "properties": [
              {
                "key": "globalSection",
                "value": {
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
                },
              },
              {
                "key": "sections",
                "value": {
                  "properties": [],
                  "type": "Object",
                },
              },
            ],
            "type": "Object",
          }
        `)
    })

    it('converts arrays to nix', () => {
        expect(iniToNix('foo[] = 1\nfoo[] = 2\nfoo[] = 3')).toMatchInlineSnapshot(`
          {
            "properties": [
              {
                "key": "globalSection",
                "value": {
                  "properties": [
                    {
                      "key": "foo",
                      "value": {
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
                            "type": "LiteralNumber",
                            "value": 3,
                          },
                        ],
                        "type": "Array",
                      },
                    },
                  ],
                  "type": "Object",
                },
              },
              {
                "key": "sections",
                "value": {
                  "properties": [],
                  "type": "Object",
                },
              },
            ],
            "type": "Object",
          }
        `)
    })
})
