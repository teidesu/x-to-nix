export async function getHighlighter() {
    const { getHighlighterInternal } = await import('./bundle')
    return await getHighlighterInternal()
}
