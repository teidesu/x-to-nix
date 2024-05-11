import { ErrorWithLocation } from './utils'
import ConverterWorker from './worker?worker'

let worker: Worker | undefined
let nextId = 0
const waiters = new Map<number, (value: any) => void>()
function initWorker() {
    if (!worker) {
        worker = new ConverterWorker()
        worker.onmessage = (event) => {
            const { id } = event.data
            const resolve = waiters.get(id)
            if (resolve) {
                resolve(event.data)
                waiters.delete(id)
            }
        }
    }
    return worker
}

export function convertToNix(language: string, code: string): Promise<string> {
    const worker = initWorker()
    const id = nextId++

    return new Promise((resolve, reject) => {
        waiters.set(id, (value) => {
            if (value.type === 'success') {
                resolve(value.payload)
            } else if (value.type === 'error-with-loc') {
                reject(new ErrorWithLocation(value.payload.message, value.payload.row, value.payload.column))
            } else {
                reject(value.payload)
            }
        })

        worker.postMessage({ type: `convert-${language}`, payload: code, id })
    })
}
