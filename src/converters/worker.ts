import type { Nix } from './nix'
import { printNix } from './nix'
import { ErrorWithLocation } from './utils'

globalThis.onmessage = async (event) => {
    const { data } = event
    const { type, payload, id } = data

    const sendError = (error: unknown) => {
        if (error instanceof ErrorWithLocation) {
            postMessage({
                type: 'error-with-loc',
                payload: {
                    message: error.message,
                    row: error.row,
                    column: error.column,
                },
                id,
            })
            return
        }

        postMessage({ type: 'error', payload: error, id })
    }

    let result: Nix.Node

    try {
        switch (type) {
            case 'convert-json': {
                const { jsonToNix } = await import('./json')
                result = jsonToNix(payload)
                break
            }
            case 'convert-yaml': {
                const { yamlToNix } = await import('./yaml')
                result = yamlToNix(payload)
                break
            }
            case 'convert-ini': {
                const { iniToNix } = await import('./ini')
                result = iniToNix(payload)
                break
            }
            case 'convert-toml': {
                const { tomlToNix } = await import('./toml')
                result = tomlToNix(payload)
                break
            }
            default: {
                sendError(new Error(`Unknown type: ${type}`))
                return
            }
        }
    } catch (error) {
        sendError(error)
        return
    }

    postMessage({ type: 'success', payload: printNix(result), id })
}
