import { Link } from 'react-router-dom'
import { Badge, Box, Group, Text, Title } from '@mantine/core'
import { imageSrcSet, imageUrl } from '../sanity/image'
import type { Category, PostSummary } from '../sanity/types'
import { formatMeta } from './format'
import './blog.css'

export function CategoryBadges({ categories }: { categories?: Category[] }) {
    if (!categories?.length) return null
    return (
        <Group gap={6}>
            {categories.map((c) => (
                <Badge key={c._id} variant="light" size="sm">
                    {c.title}
                </Badge>
            ))}
        </Group>
    )
}

export function PostCard({ post, featured = false }: { post: PostSummary; featured?: boolean }) {
    const width = featured ? 1200 : 600
    return (
        <Box
            component={Link}
            to={`/blog/${post.slug}`}
            className="blog-card"
            style={{ border: '1px solid var(--border)' }}
        >
            {post.coverImage?.asset ? (
                <img
                    className="blog-card-image"
                    src={imageUrl(post.coverImage, width, Math.round((width * 9) / 16))}
                    srcSet={imageSrcSet(post.coverImage, featured ? [600, 900, 1200] : [320, 480, 640], 16 / 9)}
                    sizes={featured ? '(max-width: 1100px) 100vw, 1100px' : '(max-width: 768px) 100vw, 360px'}
                    alt={post.coverImage.alt ?? ''}
                    loading={featured ? 'eager' : 'lazy'}
                />
            ) : null}
            <Box p="md" style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <CategoryBadges categories={post.categories} />
                <Title order={featured ? 2 : 4} className="blog-card-title" c="var(--text-h)">
                    {post.title}
                </Title>
                <Text size="sm" c="dimmed" lineClamp={featured ? 4 : 3}>
                    {post.excerpt}
                </Text>
                <Text size="xs" c="dimmed" mt="auto">
                    {formatMeta(post.publishedAt, post.readingMinutes)}
                </Text>
            </Box>
        </Box>
    )
}
