import { ErrorWithLocation } from '../../converters/utils'

import css from './ErrorWithContext.module.css'

export interface ErrorWithContextProps {
    error: unknown
    code: string
}

export function ErrorWithContext(props: ErrorWithContextProps) {
    const { error, code } = props

    if (error instanceof ErrorWithLocation) {
        const { row, column } = error
        const lines = code.split('\n')

        const lineStart = Math.max(0, row - 3)
        const lineEnd = Math.min(lines.length, row + 3)

        const maxLineNumberLen = String(lineEnd).length

        let snippet = ''
        for (let i = lineStart; i < lineEnd; i++) {
            const line = lines[i]
            const lineNumber = String(i + 1).padStart(maxLineNumberLen, ' ')
            snippet += `${lineNumber} | ${line}\n`
            if (i === row - 1) {
                snippet += `${' '.repeat(maxLineNumberLen + 1)}|${' '.repeat(column)}^\n`
            }
        }

        return (
            <div class={css.error}>
                <div class={css.snippetWrap}>
                    <div class={css.snippetBorder} />
                    <div class={css.snippet}>
                        {snippet}
                    </div>
                </div>
                <div class={css.message}>
                    <b class={css.messagePrefix}>Error:</b>
                    {' '}
                    {error.message}
                </div>
            </div>
        )
    }

    if (error instanceof Error) {
        return <pre>{error.message}</pre>
    }

    return (
        <pre>
            Error:
            {String(error)}
        </pre>
    )
}
