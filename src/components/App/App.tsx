import { SplitPane } from 'solid-split-pane'
import { Show, createEffect, createSignal, on } from 'solid-js'
import { Transition } from 'solid-transition-group'

import { ImKebabVertical } from '../Icons/glyphs/ImKebabVertical'
import { Icon } from '../Icons/Icon'
import { Editor } from '../Editor/Editor'
import { NixHighlighter } from '../NixHighlighter/NixHighlighter'
import { convertToNix } from '../../converters/port'
import { ErrorWithContext } from '../ErrorWithContext/ErrorWithContext'
import { Spin } from '../Spin/Spin'
import { CopyButton } from '../CopyButton/CopyButton'
import { Select } from '../Select/Select'
import { Button } from '../Button/Button'
import { OcGithub } from '../Icons/glyphs/OcGithub'

import css from './App.module.css'
import { DEFAULT_BY_LANG } from './constants'

function App() {
    let defaultLang = location.hash.slice(1)
    if (!(defaultLang in DEFAULT_BY_LANG)) {
        defaultLang = 'json'
    }

    const [language, setLanguage] = createSignal(defaultLang)
    const [code, setCode] = createSignal('')

    const [error, setError] = createSignal<unknown>()
    const [nix, setNix] = createSignal<string>()

    let generationId = 0
    createEffect(on(code, async (code) => {
        const thisId = ++generationId
        try {
            const nix = await convertToNix(language(), code)
            if (thisId !== generationId) return
            setError(undefined)
            setNix(nix)
        } catch (error) {
            setError(error)
        }
    }, { defer: true }))

    createEffect(on(language, (language) => {
        history.replaceState(undefined, '', `#${language}`)
    }, { defer: true }))

    return (
        <div class={css.container}>
            <div class={css.controls}>
                <Select
                    class={css.langSelect}
                    outline
                    onChange={setLanguage}
                    default={language()}
                    options={[
                        { display: 'json', value: 'json' },
                        { display: 'yaml', value: 'yaml' },
                        { display: 'ini', value: 'ini' },
                        { display: 'toml', value: 'toml' },
                    ]}
                />
                to nix
                <div class={css.spacer} />
                <Button
                    class={css.github}
                    href="https://github.com/teidesu/x-to-nix"
                    target="_blank"
                    square
                >
                    <Icon glyph={OcGithub} size={16} />
                </Button>
            </div>

            <div class={css.editors}>
                <SplitPane
                    gutterSize={16}
                    gutter={() => (
                        <div class={css.gutter}>
                            <Icon glyph={ImKebabVertical} />
                        </div>
                    ) as HTMLElement}
                    minSize={250}
                >
                    <div class={css.pane}>
                        <Editor
                            language={language()}
                            onCodeChange={setCode}
                        />
                    </div>
                    <div class={css.pane}>
                        <Transition name="fade" mode="outin">
                            <Show when={!nix() && !error()}>
                                <div class={css.loaderWrap}>
                                    <Spin class={css.loader} />
                                </div>
                            </Show>
                            <Show when={error() || nix()}>
                                <div class={css.resultWrap}>
                                    {(() => {
                                        const _nix = nix()
                                        const _error = error()

                                        if (_error) {
                                            return <ErrorWithContext error={_error} code={code()} />
                                        }

                                        return <NixHighlighter code={_nix!} />
                                    })()}
                                </div>
                            </Show>
                        </Transition>

                        <CopyButton text={nix} class={css.copyButton} />
                    </div>
                </SplitPane>
            </div>
        </div>
    )
}

export default App
