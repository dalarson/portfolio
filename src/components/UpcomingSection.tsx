import { useEffect, useState } from 'react'
import { Card, Loader, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { fetchUpcoming } from '../sanity/queries'
import { imageSrcSet, imageUrl } from '../sanity/image'
import type { UpcomingProject } from '../sanity/types'

export function UpcomingSection() {
    const [items, setItems] = useState<UpcomingProject[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        fetchUpcoming({ signal: controller.signal })
            .then((data) => {
                setItems(data)
                setLoading(false)
            })
            .catch(() => {
                if (!controller.signal.aborted) setLoading(false)
            })
        return () => controller.abort()
    }, [])

    return (
        <Stack gap="xl" pt="md">
                <Text c="dimmed" ta="center">A sneak peek at what I'm planning to build next.</Text>
                {loading ? (
                    <Loader size="sm" mx="auto" />
                ) : items.length === 0 ? (
                    <Text c="dimmed" ta="center">Nothing here yet. Check back soon.</Text>
                ) : (
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
                                    <Title order={4} c="black">{item.title}</Title>
                                    <Text size="sm" c="dimmed">{item.description}</Text>
                                </Stack>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
        </Stack>
    )
}
