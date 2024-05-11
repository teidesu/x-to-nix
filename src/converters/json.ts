import type { ValueNode } from '@humanwhocodes/momoa'
import { ErrorWithLocation as MomoaErrorWithLocation, parse } from '@humanwhocodes/momoa'

import type { Nix } from './nix'
import { ErrorWithLocation } from './utils'

export function jsonToNix(json: string): Nix.Node {
    try {
        const ast = parse(json, {
            mode: 'jsonc',
            ranges: false,
            tokens: false,
        })

        return jsonValueToNix(ast.body)
    } catch (e) {
        if (e instanceof MomoaErrorWithLocation) {
            throw new ErrorWithLocation(e.originalMessage, e.line, e.column)
        }

        throw e
    }
}

function jsonValueToNix(value: ValueNode): Nix.Node {
    switch (value.type) {
        case 'Object':
            return {
                type: 'Object',
                properties: value.members.map(member => ({
                    key: member.name.value,
                    value: jsonValueToNix(member.value),
                })),
            }
        case 'Array':
            return {
                type: 'Array',
                elements: value.elements.map(element => jsonValueToNix(element.value)),
            }
        case 'String':
            return {
                type: 'LiteralString',
                value: value.value,
            }
        case 'Number':
            return {
                type: 'LiteralNumber',
                value: value.value,
            }
        case 'Boolean':
            return {
                type: 'LiteralBoolean',
                value: value.value,
            }
        case 'Null':
            return {
                type: 'LiteralNull',
            }
    }
}
