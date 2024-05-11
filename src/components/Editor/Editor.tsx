import type * as monacoTypes from 'monaco-editor'
import { createEffect, on, onMount } from 'solid-js'

import { DEFAULT_BY_LANG } from '../App/constants'
import { useColorScheme } from '../../utils/use-color-scheme'

import css from './Editor.module.css'

export interface EditorProps {
    language: string
    onCodeChange: (code: string) => void
}

export function Editor(props: EditorProps) {
    let ref!: HTMLDivElement
    let editor: monacoTypes.editor.IStandaloneCodeEditor | undefined
    let monaco: typeof monacoTypes | undefined

    const scheme = useColorScheme()
    const monacoTheme = () => scheme() === 'dark' ? 'ayu-dark' : 'ayu-light'

    onMount(async () => {
        const init = await import('./utils/init-monaco')
        const initResult = await init.initMonaco(ref, {
            value: DEFAULT_BY_LANG[props.language],
            language: props.language,
            automaticLayout: true,
            minimap: {
                enabled: false,
            },
            scrollbar: {
                verticalScrollbarSize: 8,
            },
            lineNumbersMinChars: 3,
            theme: monacoTheme(),
            scrollBeyondLastLine: false,
        })

        editor = initResult.editor
        monaco = initResult.monaco

        editor.onDidChangeModelContent(() => {
            props.onCodeChange(editor?.getValue() ?? '')
        })

        props.onCodeChange(DEFAULT_BY_LANG[props.language])

        return () => editor?.dispose()
    })

    createEffect(on(() => props.language, (language) => {
        if (!editor) return
        const model = editor.getModel()
        if (!model) return

        model.setValue(DEFAULT_BY_LANG[language] ?? '')
        monaco?.editor.setModelLanguage(model, language)
    }, { defer: true }))

    createEffect(on(() => monacoTheme(), (theme) => {
        if (!editor) return
        editor.updateOptions({ theme })
    }))

    return (
        <div class={css.editor} ref={ref} />
    )
}
