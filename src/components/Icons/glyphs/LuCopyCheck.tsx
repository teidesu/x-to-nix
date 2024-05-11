/* Lucide Icons, by Dariush Habibpour. ISC License: https://github.com/lucide-icons/lucide/blob/main/LICENSE */

import type { JSX } from 'solid-js/jsx-runtime'

export function LuCopyCheck(props: JSX.IntrinsicElements['svg']) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="m12 15l2 2l4-4" />
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </g>
        </svg>
    )
}
