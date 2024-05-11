import { splitProps } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'
import clsx from 'clsx'

import css from './Button.module.css'

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    square?: boolean
    outline?: boolean

    href?: string
    target?: string
}

export function Button(props: ButtonProps) {
    const [my, rest] = splitProps(props, ['square', 'outline', 'class', 'href', 'target'])

    const cls = () => clsx(
        css.button,
        my.square && css.square,
        my.outline && css.outline,
        my.class,
    )

    return props.href
        ? (
            <a
                {...rest as any}
                href={props.href}
                target={props.target}
                class={cls()}
            />
            )
        : (
            <button
                {...rest}
                class={cls()}
            />
            )
}
