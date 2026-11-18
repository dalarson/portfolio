import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Anchor, Badge, Box, Button, Container, Divider, Group, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft, IconArrowRight, IconBrandLinkedin, IconBrandX, IconCheck, IconLink } from '@tabler/icons-react'
import { imageSrcSet, imageUrl } from '../sanity/image'
import { fetchPostBySlug, fetchRelatedPosts } from '../sanity/queries'
import type { Post, PostSummary } from '../sanity/types'
import { buildHeadingIds, extractHeadings } from './headings'
import { formatDate } from './format'
import { CategoryBadges, PostCard } from './PostCard'
import PostBody from './PostBody'
import TableOfContents from './TableOfContents'
import './blog.css'

type State = { status: 'loading' } | { status: 'error' } | { status: 'notfound' } | { status: 'ready'; post: Post }

function NotFound() {
    return (
        <Container size="sm" pt={140} pb="xl">
            <Stack align="center" gap="md">
                <Title order={1}>Article not found</Title>
                <Text c="dimmed">The article you're looking for doesn't exist or is no longer available.</Text>
                <Button component={Link} to="/blog" leftSection={<IconArrowLeft size={16} />}>
                    Back to blog
                </Button>
            </Stack>
        </Container>
    )
}

function BlogPostView({ slug }: { slug: string }) {
    const [state, setState] = useState<State>({ status: 'loading' })
    const [related, setRelated] = useState<PostSummary[]>([])
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        window.scrollTo(0, 0)
        fetchPostBySlug(slug, { signal: controller.signal })
            .then((post) => {
                if (!post) return setState({ status: 'notfound' })
                setState({ status: 'ready', post })
                fetchRelatedPosts(post, 3, { signal: controller.signal }).then(setRelated).catch(() => {})
            })
            .catch((e) => {
                if (controller.signal.aborted) return
                console.error(e)
                setState({ status: 'error' })
            })
        return () => controller.abort()
    }, [slug])

    const post = state.status === 'ready' ? state.post : null

    useEffect(() => {
        if (post) document.title = `${post.seoTitle || post.title} | David Larson`
        else if (state.status === 'notfound') document.title = 'Article not found | David Larson'
    }, [post, state.status])

    const headings = useMemo(() => {
        if (!post) return []
        return extractHeadings(post.body, buildHeadingIds(post.body))
    }, [post])

    if (state.status === 'notfound') return <NotFound />

    if (state.status === 'error') {
        return (
            <Container size="sm" pt={140} pb="xl">
                <Alert color="red" title="Couldn't load this article">
                    Something went wrong while loading the article. Please try again later.
                </Alert>
                <Button component={Link} to="/blog" mt="md" variant="default">
                    Back to blog
                </Button>
            </Container>
        )
    }

    if (!post) {
        return (
            <Container size="sm" pt={140} pb="xl">
                <Skeleton height={48} mb="md" />
                <Skeleton height={20} width="40%" mb="xl" />
                <Skeleton height={360} mb="xl" />
                <Skeleton height={16} mb="sm" />
                <Skeleton height={16} mb="sm" />
                <Skeleton height={16} width="70%" />
            </Container>
        )
    }

    const url = typeof window !== 'undefined' ? window.location.href : ''
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            /* clipboard unavailable */
        }
    }

    return (
        <Container size="xl" pt={110} pb="xl">
            <Box className="blog-post-main" style={{ margin: '0 auto 2rem' }}>
                <Anchor component={Link} to="/blog" size="sm" c="dimmed">
                    <Group gap={4}>
                        <IconArrowLeft size={14} /> Back to blog
                    </Group>
                </Anchor>
                <Stack gap="md" mt="lg">
                    <CategoryBadges categories={post.categories} />
                    <Title order={1} className="blog-title" c="var(--text-h)">
                        {post.title}
                    </Title>
                    <Text size="lg" c="dimmed">
                        {post.excerpt}
                    </Text>
                    <Text size="sm" c="dimmed">
                        {post.author ? `${post.author} · ` : ''}
                        {formatDate(post.publishedAt)} · {post.readingMinutes} min read
                        {post.updatedAt && post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10)
                            ? ` · Updated ${formatDate(post.updatedAt)}`
                            : ''}
                    </Text>
                </Stack>
                {post.coverImage?.asset && (
                    <img
                        src={imageUrl(post.coverImage, 1200, 675)}
                        srcSet={imageSrcSet(post.coverImage, [600, 900, 1200], 16 / 9)}
                        sizes="(max-width: 800px) 100vw, 760px"
                        alt={post.coverImage.alt ?? ''}
                        width={1200}
                        height={675}
                        style={{ width: '100%', height: 'auto', borderRadius: 12, marginTop: 24 }}
                    />
                )}
            </Box>

            <div className="blog-post-layout">
                <TableOfContents headings={headings} />
                <article className="blog-post-main">
                    <PostBody body={post.body} />

                    <Divider my="xl" />

                    {post.tags && post.tags.length > 0 && (
                        <Group gap={6} mb="md">
                            {post.tags.map((t) => (
                                <Badge key={t} variant="outline" color="gray" size="sm">
                                    #{t}
                                </Badge>
                            ))}
                        </Group>
                    )}

                    <Group gap="xs" mb="xl">
                        <Text size="sm" fw={600}>
                            Share
                        </Text>
                        <Button
                            size="xs"
                            variant="default"
                            onClick={copy}
                            leftSection={copied ? <IconCheck size={14} /> : <IconLink size={14} />}
                        >
                            {copied ? 'Copied' : 'Copy link'}
                        </Button>
                        <Button
                            size="xs"
                            variant="default"
                            component="a"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`}
                            leftSection={<IconBrandX size={14} />}
                        >
                            X
                        </Button>
                        <Button
                            size="xs"
                            variant="default"
                            component="a"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                            leftSection={<IconBrandLinkedin size={14} />}
                        >
                            LinkedIn
                        </Button>
                    </Group>

                    {(post.previous || post.next) && (
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
                            {post.previous ? (
                                <Box component={Link} to={`/blog/${post.previous.slug}`} className="blog-card" p="md" style={{ border: '1px solid var(--border)' }}>
                                    <Text size="xs" c="dimmed">
                                        <IconArrowLeft size={12} /> Previous
                                    </Text>
                                    <Text fw={600}>{post.previous.title}</Text>
                                </Box>
                            ) : (
                                <div />
                            )}
                            {post.next && (
                                <Box component={Link} to={`/blog/${post.next.slug}`} className="blog-card" p="md" style={{ border: '1px solid var(--border)', textAlign: 'right' }}>
                                    <Text size="xs" c="dimmed">
                                        Next <IconArrowRight size={12} />
                                    </Text>
                                    <Text fw={600}>{post.next.title}</Text>
                                </Box>
                            )}
                        </SimpleGrid>
                    )}
                </article>
            </div>

            {related.length > 0 && (
                <Box mt="xl">
                    <Title order={3} mb="md">
                        Related articles
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                        {related.map((p) => (
                            <PostCard key={p._id} post={p} />
                        ))}
                    </SimpleGrid>
                </Box>
            )}
        </Container>
    )
}

export default function BlogPost() {
    const { slug = '' } = useParams()
    return <BlogPostView key={slug} slug={slug} />
}
