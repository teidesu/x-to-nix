import { SyntaxParseError, load } from 'js-toml'

import { ErrorWithLocation } from './utils'
import type { Nix } from './nix'

function toNixValue(value: unknown): Nix.Node {
    if (typeof value === 'string') {
        return { type: 'LiteralString', value }
    }

    if (value === null) {
        return { type: 'LiteralNull' }
    }

    if (typeof value === 'number') {
        return { type: 'LiteralNumber', value }
    }

    if (value instanceof Date) {
        return { type: 'LiteralString', value: value.toISOString() }
    }

    if (typeof value === 'boolean') {
        return { type: 'LiteralBoolean', value }
    }

    if (Array.isArray(value)) {
        return {
            type: 'Array',
            elements: value.map(toNixValue),
        }
    }

    if (value && typeof value === 'object') {
        return {
            type: 'Object',
            properties: Object.entries(value).map(([key, value]) => ({
                key,
                value: toNixValue(value),
            })),
        }
    }

    throw new Error(`Unsupported value type: ${typeof value}`)
}

export function tomlToNix(toml: string) {
    try {
        const obj = load(toml)
        return toNixValue(obj)
    } catch (e) {
        if (e instanceof SyntaxParseError) {
            // there are no typings for these for whatever reason
            const error = (e as any).errors[0]
            const name = error.name
            let line, column
            if ('token' in error) {
                const token = Number.isNaN(error.token?.startOffset) ? error.previousToken : error.token
                if (token) {
                    line = token.startLine
                    column = token.startColumn
                }
            } else if ('line' in error) {
                line = error.line
                column = error.column
            } else {
                throw e
            }

            if (!Number.isNaN(line) && !Number.isNaN(column)) {
                throw new ErrorWithLocation(`${name}: ${error.message}`, line, column)
            }
        }

        throw e
    }
}
