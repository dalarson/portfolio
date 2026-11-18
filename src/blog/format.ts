export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatMeta(publishedAt: string, minutes: number): string {
    return `${formatDate(publishedAt)} · ${minutes} min read`
}
