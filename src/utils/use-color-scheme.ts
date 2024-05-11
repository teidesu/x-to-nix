import { createSignal, onMount } from 'solid-js'

export type ColorScheme = 'light' | 'dark'

export function useColorScheme() {
    const [scheme, setScheme] = createSignal<ColorScheme>(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

    onMount(() => {
        const listener = (e: MediaQueryListEvent) => setScheme(e.matches ? 'dark' : 'light')
        const media = matchMedia('(prefers-color-scheme: dark)')
        media.addEventListener('change', listener)

        return () => media.removeEventListener('change', listener)
    })

    return scheme
}
