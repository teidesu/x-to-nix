export class ErrorWithLocation extends Error {
    constructor(message: string, readonly row: number, readonly column: number) {
        super(message)
    }
}
