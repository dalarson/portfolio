import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImageSource {
    _type?: 'image'
    asset: { _ref: string; _type: 'reference' }
    hotspot?: unknown
    crop?: unknown
    alt?: string
}

export interface Category {
    _id: string
    title: string
    slug: string
    description?: string
    displayOrder?: number
}

export interface PostSummary {
    _id: string
    title: string
    slug: string
    excerpt: string
    publishedAt: string
    updatedAt?: string
    coverImage?: SanityImageSource
    categories: Category[]
    readingMinutes: number
}

export interface PostNeighbor {
    title: string
    slug: string
}

export interface Post extends PostSummary {
    body: PortableTextBlock[]
    tags?: string[]
    author?: string
    seoTitle?: string
    seoDescription?: string
    previous: PostNeighbor | null
    next: PostNeighbor | null
}

export interface UpcomingProject {
    _id: string
    title: string
    description: string
    image?: SanityImageSource
}
