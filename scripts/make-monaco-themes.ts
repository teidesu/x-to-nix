import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { textmateThemeToMonacoTheme } from '@shikijs/monaco'

import { getHighlighter } from '../src/shiki/index'

const highlighter = await getHighlighter()
const outDir = fileURLToPath(new URL('../src/components/Editor/utils', import.meta.url))

await writeFile(`${outDir}/ayu-light.json`, `${JSON.stringify(textmateThemeToMonacoTheme(highlighter.getTheme('ayu-light')), null, 4)}\n`)
await writeFile(`${outDir}/ayu-dark.json`, `${JSON.stringify(textmateThemeToMonacoTheme(highlighter.getTheme('ayu-dark')), null, 4)}\n`)
