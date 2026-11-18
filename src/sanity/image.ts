import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from './types'

// Public, read-only client for published content. No token is ever used here.
export const blogClient = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
    apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
    useCdn: true,
})

const builder = createImageUrlBuilder(blogClient)

export function imageUrl(source: SanityImageSource, width: number, height?: number) {
    let b = builder.image(source).width(width).auto('format').fit('crop')
    if (height) b = b.height(height)
    return b.url()
}

export function imageSrcSet(source: SanityImageSource, widths: number[], aspect?: number) {
    return widths
        .map((w) => `${imageUrl(source, w, aspect ? Math.round(w / aspect) : undefined)} ${w}w`)
        .join(', ')
}
