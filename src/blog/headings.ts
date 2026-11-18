import type { PortableTextBlock } from '@portabletext/types'

export interface Heading {
    id: string
    text: string
    level: 2 | 3
}

const HEADING_STYLES = ['h1', 'h2', 'h3', 'h4']

function blockText(block: PortableTextBlock): string {
    const children = (block as { children?: { text?: string }[] }).children ?? []
    return children.map((c) => c.text ?? '').join('')
}

function slugify(text: string): string {
    return (
        text
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'section'
    )
}

/** Deterministic, per-article unique heading IDs keyed by block _key. */
export function buildHeadingIds(body: PortableTextBlock[]): Map<string, string> {
    const used = new Map<string, number>()
    const ids = new Map<string, string>()
    for (const block of body) {
        if (block._type !== 'block' || !HEADING_STYLES.includes(block.style ?? '')) continue
        const base = slugify(blockText(block))
        const count = used.get(base) ?? 0
        used.set(base, count + 1)
        ids.set(block._key ?? '', count === 0 ? base : `${base}-${count + 1}`)
    }
    return ids
}

export function extractHeadings(body: PortableTextBlock[], ids: Map<string, string>): Heading[] {
    const headings: Heading[] = []
    for (const block of body) {
        if (block._type !== 'block' || (block.style !== 'h2' && block.style !== 'h3')) continue
        const id = ids.get(block._key ?? '')
        const text = blockText(block).trim()
        if (id && text) headings.push({ id, text, level: block.style === 'h2' ? 2 : 3 })
    }
    return headings
}
