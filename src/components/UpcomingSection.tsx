import { useEffect, useState } from 'react'
import { Box, Card, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { fetchUpcoming } from '../sanity/queries'
import { imageSrcSet, imageUrl } from '../sanity/image'
import type { UpcomingPage, UpcomingProject } from '../sanity/types'

export function UpcomingSection({ page }: { page: UpcomingPage }) {
    const [items, setItems] = useState<UpcomingProject[]>([])

    useEffect(() => {
        const controller = new AbortController()
        fetchUpcoming(page, { signal: controller.signal }).then(setItems).catch(() => { })
        return () => controller.abort()
    }, [page])

    if (items.length === 0) return null

    return (
        <Box component="section" aria-labelledby={`upcoming-${page}`}>
            <Stack gap="md">
                <Title order={2} id={`upcoming-${page}`} c="var(--text-h)">
                    Up-and-Coming
                </Title>
                <Text c="dimmed">A sneak peek at what I'm planning to build next.</Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    {items.map((item) => (
                        <Card key={item._id} withBorder radius="md" padding={0}>
                            {item.image?.asset && (
                                <img
                                    src={imageUrl(item.image, 600, 338)}
                                    srcSet={imageSrcSet(item.image, [320, 480, 640], 16 / 9)}
                                    sizes="(max-width: 768px) 100vw, 400px"
                                    alt={item.image.alt ?? item.title}
                                    loading="lazy"
                                    style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }}
                                />
                            )}
                            <Stack gap={6} p="md">
                                <Title order={4} c="var(--text-h)">{item.title}</Title>
                                <Text size="sm" c="dimmed">{item.description}</Text>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            </Stack>
        </Box>
    )
}
