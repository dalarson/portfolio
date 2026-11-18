import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Alert, Box, Button, Container, Group, Loader, Skeleton, Stack, Text, Title } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { fetchCategories, fetchFeaturedPost, fetchPosts } from '../sanity/queries'
import type { Category, PostSummary } from '../sanity/types'
import { PostCard } from './PostCard'
import './blog.css'

export default function BlogIndex() {
    const [params, setParams] = useSearchParams()
    const category = params.get('category') ?? ''

    const [categories, setCategories] = useState<Category[]>([])
    const [featured, setFeatured] = useState<PostSummary | null>(null)
    const [posts, setPosts] = useState<PostSummary[]>([])
    const [total, setTotal] = useState(0)
    const [loaded, setLoaded] = useState(0)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState(false)
    const [retryKey, setRetryKey] = useState(0)
    const pageRef = useRef(0)

    useEffect(() => {
        document.title = 'Blog | David Larson'
        const controller = new AbortController()
        fetchCategories({ signal: controller.signal }).then(setCategories).catch(() => {})
        fetchFeaturedPost({ signal: controller.signal }).then(setFeatured).catch(() => {})
        return () => controller.abort()
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        pageRef.current = 0
        setLoading(true)
        setError(false)
        fetchPosts(category, 0, { signal: controller.signal })
            .then(({ posts, total }) => {
                setPosts(posts)
                setTotal(total)
                setLoaded(posts.length)
                setLoading(false)
            })
            .catch((e) => {
                if (controller.signal.aborted) return
                console.error(e)
                setError(true)
                setLoading(false)
            })
        return () => controller.abort()
    }, [category, retryKey])

    const loadMore = useCallback(async () => {
        setLoadingMore(true)
        try {
            const next = pageRef.current + 1
            const { posts: more, total } = await fetchPosts(category, next)
            pageRef.current = next
            setPosts((prev) => [...prev, ...more])
            setLoaded((n) => n + more.length)
            setTotal(total)
        } catch (e) {
            console.error(e)
            setError(true)
        } finally {
            setLoadingMore(false)
        }
    }, [category])

    const selectCategory = (slug: string) => {
        setParams(slug ? { category: slug } : {})
    }

    const showFeatured = !!featured && !category
    const visible = showFeatured ? posts.filter((p) => p._id !== featured._id) : posts
    const hasMore = loaded < total
    const activeCategory = categories.find((c) => c.slug === category)

    return (
        <Container size="lg" pt={110} pb="xl">
            <Stack gap="xl">
                <Box maw={680} mx="auto">
                    <Title order={1} className="blog-title" c="var(--text-h)">
                        Writing &amp; Ideas
                    </Title>
                    <Text size="lg" c="dimmed" mt="sm">
                        Thoughts, experiments, and lessons from building software, exploring technology, and
                        working through interesting problems.
                    </Text>
                </Box>

                {showFeatured && featured && <PostCard post={featured} featured />}

                {categories.length > 0 && (
                    <Group gap="xs" justify="center" role="tablist" aria-label="Filter by category">
                        {[{ _id: 'all', title: 'All', slug: '' }, ...categories].map((c) => (
                            <Button
                                key={c._id}
                                size="compact-md"
                                radius="xl"
                                role="tab"
                                aria-selected={category === c.slug}
                                variant={category === c.slug ? 'filled' : 'light'}
                                color={category === c.slug ? 'dark' : 'gray'}
                                onClick={() => selectCategory(c.slug)}
                                style={{ transition: 'all 0.15s ease' }}
                            >
                                {c.title}
                            </Button>
                        ))}
                    </Group>
                )}

                {error && (
                    <Alert color="red" icon={<IconAlertCircle size={16} />} title="Couldn't load articles">
                        Something went wrong while loading the blog. Please try again in a moment.
                        <Button mt="sm" size="xs" variant="light" color="red" onClick={() => setRetryKey((k) => k + 1)}>
                            Retry
                        </Button>
                    </Alert>
                )}

                {loading ? (
                    <div className="blog-grid">
                        {[0, 1, 2].map((i) => (
                            <Skeleton key={i} height={320} radius="md" />
                        ))}
                    </div>
                ) : (
                    !error &&
                    (visible.length === 0 ? (
                        <Text c="dimmed" ta="center" py="xl">
                            {category
                                ? `No articles in ${activeCategory?.title ?? 'this category'} yet.`
                                : showFeatured
                                  ? 'More articles coming soon.'
                                  : 'No articles have been published yet. Check back soon.'}
                        </Text>
                    ) : (
                        <div className="blog-grid">
                            {visible.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    ))
                )}

                {!loading && !error && hasMore && (
                    <Group justify="center">
                        <Button variant="default" onClick={loadMore} disabled={loadingMore}>
                            {loadingMore ? <Loader size="xs" /> : 'Load more'}
                        </Button>
                    </Group>
                )}
            </Stack>
        </Container>
    )
}
