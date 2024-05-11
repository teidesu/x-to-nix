import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { configureMonacoYaml } from 'monaco-yaml'

import ayuLight from './ayu-light.json'
import ayuDark from './ayu-dark.json'
import * as Toml from './toml'
import YamlWorker from './yaml.worker?worker'
import 'monaco-editor/esm/vs/basic-languages/ini/ini.contribution'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'

window.MonacoEnvironment = {
    getWorker(_, label) {
        switch (label) {
            case 'json':
                return new JsonWorker()
            case 'yaml':
                return new YamlWorker()
            default:
                return new EditorWorker()
        }
    },
}

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: false,
    allowComments: true,
})
monaco.editor.defineTheme('ayu-light', ayuLight as any)
monaco.editor.defineTheme('ayu-dark', ayuDark as any)
monaco.languages.register({ id: 'toml' })
monaco.languages.setMonarchTokensProvider('toml', Toml.language)
monaco.languages.setLanguageConfiguration('toml', Toml.conf)
configureMonacoYaml(monaco)

export function initMonaco(container: HTMLElement, options: monaco.editor.IStandaloneEditorConstructionOptions) {
    const editor = monaco.editor.create(container, options)
    return { monaco, editor }
}
