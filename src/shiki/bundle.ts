import { getHighlighterCore } from 'shiki/core'
import getWasm from 'shiki/wasm'
import nix from 'shiki/langs/nix.mjs'
import ini from 'shiki/langs/ini.mjs'
import toml from 'shiki/langs/toml.mjs'

import lightTheme from '../ayu/ayu-light.json' assert { type: 'json' }
import darkTheme from '../ayu/ayu-dark.json' assert { type: 'json' }

export async function getHighlighterInternal() {
    return getHighlighterCore({
        themes: [
            lightTheme as any,
            darkTheme as any,
        ],
        langs: [
            nix,
            ini,
            toml,
        ],
        loadWasm: getWasm,
    })
}
