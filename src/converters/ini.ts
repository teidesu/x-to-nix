import { parse } from 'ini'

import type { Nix } from './nix'

function toNixValue(value: unknown): Nix.Node {
    if (typeof value === 'string') {
        if (value.length > 0 && !Number.isNaN(Number(value))) {
            return { type: 'LiteralNumber', value: Number(value) }
        }

        return { type: 'LiteralString', value }
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

export function iniToNix(ini: string): Nix.Node {
    const parsed = parse(ini)

    const globalSection: Record<string, Nix.Node> = {}
    const sections: Record<string, Nix.Node> = {}

    for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
            sections[key] = toNixValue(value)
        } else {
            globalSection[key] = toNixValue(value)
        }
    }

    const sectionsObject: Nix.Node = {
        type: 'Object',
        properties: Object.entries(sections).map(([key, value]) => ({
            key,
            value,
        })),
    }

    if (Object.keys(globalSection).length === 0) {
        return sectionsObject
    }

    // for use with toINIWithGlobalSection
    return {
        type: 'Object',
        properties: [
            {
                key: 'globalSection',
                value: {
                    type: 'Object',
                    properties: Object.entries(globalSection).map(([key, value]) => ({
                        key,
                        value,
                    })),
                },
            },
            {
                key: 'sections',
                value: sectionsObject,
            },
        ],
    }
}
