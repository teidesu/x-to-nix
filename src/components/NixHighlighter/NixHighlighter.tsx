import { Suspense, createResource } from 'solid-js'
import clsx from 'clsx'

import { getHighlighter } from '../../shiki'

import css from './NixHighlighter.module.css'

export function NixHighlighter(props: { code: string }) {
    const [highlightedCode] = createResource(async () => {
        const highlighter = await getHighlighter()
        const result = highlighter.codeToHtml(props.code, {
            lang: 'nix',
            themes: {
                light: 'ayu-light',
                dark: 'ayu-dark',
            },
        })

        return <div innerHTML={result} />
    })

    return (
        <div class={clsx(css.code)}>
            <Suspense fallback={props.code}>
                {highlightedCode()}
            </Suspense>
        </div>
    )
}
