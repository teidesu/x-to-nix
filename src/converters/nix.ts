// eslint-disable-next-line ts/no-namespace
export namespace Nix {
    export interface LiteralString {
        type: 'LiteralString'
        value: string
    }

    export interface LiteralNumber {
        type: 'LiteralNumber'
        value: number
    }

    export interface LiteralBoolean {
        type: 'LiteralBoolean'
        value: boolean
    }

    export interface LiteralNull {
        type: 'LiteralNull'
    }

    export interface Array {
        type: 'Array'
        elements: Node[]
    }

    export interface Object {
        type: 'Object'
        properties: ObjectProperty[]
    }

    export interface ObjectProperty {
        key: string
        value: Node
    }

    // eslint-disable-next-line ts/ban-types
    export type Node = Object | Array | LiteralString | LiteralNumber | LiteralBoolean | LiteralNull
}

function indent(space: string, text: string): string {
    return text.split('\n').map(line => space + line).join('\n')
}

const WRAP = 40

export function printNix(ast: Nix.Node): string {
    switch (ast.type) {
        case 'LiteralString':
            if (ast.value.includes('\n')) {
                const content = indent(
                    '  ',
                    ast.value
                        .replace(/''/g, "''''")
                        .replace('${', '\'$\{')
                        .replace(/\n$/, ''),
                )
                return `''\n${content}${ast.value.endsWith('\n') ? '\n' : ''}''`
            }

            return JSON.stringify(ast.value)
        case 'LiteralNumber':
            return String(ast.value)
        case 'LiteralBoolean':
            return ast.value ? 'true' : 'false'
        case 'LiteralNull':
            return 'null'
        case 'Array': {
            let multiline = false
            let totalLength = 0
            const printed = ast.elements.map((element) => {
                const nix = printNix(element)
                if (nix.includes('\n')) multiline = true
                totalLength += nix.length
                if (totalLength > WRAP) multiline = true
                return nix
            })

            if (multiline) {
                return `[\n${printed.map(nix => indent('  ', nix)).join('\n')}\n]`
            }
            return `[ ${printed.join(' ')} ]`
        }
        case 'Object': {
            let multiline = ast.properties.length > 2
            let totalLength = 0
            const printed = ast.properties.map((property) => {
                let key = property.key
                if (!key.match(/^[a-zA-Z_][a-zA-Z0-9_'-]*$/)) {
                    key = `"${key.replace(/"/g, '\\"')}"`
                }

                const nix = `${key} = ${printNix(property.value)};`

                if (nix.includes('\n')) {
                    multiline = true
                }

                totalLength += nix.length
                if (totalLength > WRAP) multiline = true
                return nix
            })

            if (multiline) {
                return `{\n${printed.map(nix => indent('  ', nix)).join('\n')}\n}`
            }
            return `{ ${printed.join(' ')} }`
        }
    }
}
