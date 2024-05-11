import { type Accessor, Show, createSignal } from 'solid-js'
import { Transition } from 'solid-transition-group'
import clsx from 'clsx'

import { Button } from '../Button/Button'
import { LuCopy } from '../Icons/glyphs/LuCopy'
import { LuCopyCheck } from '../Icons/glyphs/LuCopyCheck'
import { Icon } from '../Icons/Icon'

import css from './CopyButton.module.css'

export interface CopyButtonProps {
    class?: string
    text: Accessor<string | undefined>
}

export function CopyButton(props: CopyButtonProps) {
    const [justCopied, setJustCopied] = createSignal(false)
    const copy = async () => {
        if (justCopied()) return

        const _text = props.text()
        if (!_text) return
        await navigator.clipboard.writeText(_text)

        setJustCopied(true)
        setTimeout(() => setJustCopied(false), 2000)
    }

    return (
        <Button square outline onClick={copy} class={clsx(css.button, props.class)}>
            <Icon
                glyph={() => (
                    <>
                        <LuCopy />
                        <Transition name="fade">
                            {justCopied() && <LuCopyCheck class={css.iconOverlay} />}
                        </Transition>
                    </>
                )}
                size={16}
            />
            <Transition name="slide-left-right">
                <Show when={justCopied()}>
                    <div class={css.popup}>
                        copied!
                    </div>
                </Show>
            </Transition>
        </Button>
    )
}
