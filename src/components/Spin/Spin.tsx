import clsx from 'clsx'

import css from './Spin.module.css'

export interface SpinProps {
    class?: string
}

export function Spin(props: SpinProps) {
    return (
        <svg
            class={clsx(css.spinner, props.class)}
            viewBox="0 0 100 100"
        >
            <path
                d="M 4 46 A 46 46 1 0 1 46 4"
                stroke-linecap="round"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
            />
        </svg>
    )
}
