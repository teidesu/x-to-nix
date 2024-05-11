import type { ParsedNode } from 'yaml'
import { LineCounter, Scalar, YAMLMap, YAMLSeq, parseDocument } from 'yaml'

import type { Nix } from './nix'
import { ErrorWithLocation } from './utils'

function rangeToLineRange(range: [number, number, number?], lineCounter: LineCounter): [number, number] {
    const start = lineCounter.linePos(range[0])
    return [start.line, start.col]
}

export function yamlToNix(yaml: string): Nix.Node {
    const lineCounter = new LineCounter()
    const doc = parseDocument(yaml, {
        logLevel: 'error',
        lineCounter,
        prettyErrors: false,
    })
    if (doc.errors.length > 0) {
        const error = doc.errors[0]
        throw new ErrorWithLocation(error.message, ...rangeToLineRange(error.pos, lineCounter))
    }
    if (!doc.contents) throw new Error('No document contents')

    return yamlNodeToNix(doc.contents, lineCounter)
}

function yamlNodeToNix(value: ParsedNode, lineCounter: LineCounter): Nix.Node {
    switch (true) {
        case value instanceof YAMLMap:
            return {
                type: 'Object',
                properties: value.items.map((item): Nix.ObjectProperty => {
                    // console.log(item.key)
                    if (!(item.key instanceof Scalar)) {
                        throw new ErrorWithLocation('Unsupported key type', ...rangeToLineRange(item.key.range, lineCounter))
                    }
                    if (item.value === null) {
                        return {
                            key: `${item.key.value}`,
                            value: {
                                type: 'LiteralNull',
                            },
                        }
                    }

                    return {
                        key: `${item.key.value}`,
                        value: yamlNodeToNix(item.value, lineCounter),
                    }
                }),
            }
        case value instanceof YAMLSeq:
            return {
                type: 'Array',
                elements: value.items.map(item => yamlNodeToNix(item, lineCounter)),
            }
        case value instanceof Scalar: {
            if (value.value === null) {
                return {
                    type: 'LiteralNull',
                }
            }

            if (typeof value.value === 'string') {
                return {
                    type: 'LiteralString',
                    value: value.value,
                }
            }

            if (typeof value.value === 'number') {
                return {
                    type: 'LiteralNumber',
                    value: value.value,
                }
            }

            if (typeof value.value === 'boolean') {
                return {
                    type: 'LiteralBoolean',
                    value: value.value,
                }
            }

            throw new ErrorWithLocation(`Unsupported scalar type: ${typeof value.value} (${value.value})`, ...rangeToLineRange(value.range, lineCounter))
        }
    }

    throw new ErrorWithLocation(`Unsupported node type: ${value.constructor.name}`, ...rangeToLineRange(value.range, lineCounter))
}
