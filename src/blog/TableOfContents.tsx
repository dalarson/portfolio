import { useEffect, useState } from 'react'
import { Box, Collapse, Text, UnstyledButton } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import type { Heading } from './headings'
import './blog.css'

function useActiveHeading(headings: Heading[]) {
    const [active, setActive] = useState<string>('')

    useEffect(() => {
        const elements = headings
            .map((h) => document.getElementById(h.id))
            .filter((el): el is HTMLElement => !!el)
        if (!elements.length) return
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting)
                if (visible.length) {
                    const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
                    setActive(top.target.id)
                }
            },
            { rootMargin: '-90px 0px -70% 0px' },
        )
        elements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [headings])

    return active
}

function TocLinks({ headings, active, onNavigate }: { headings: Heading[]; active: string; onNavigate?: () => void }) {
    const go = (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        history.replaceState(null, '', `#${id}`)
        onNavigate?.()
    }
    return (
        <nav className="blog-toc" aria-label="Table of contents">
            {headings.map((h) => (
                <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`${h.level === 3 ? 'nested' : ''} ${active === h.id ? 'active' : ''}`}
                    aria-current={active === h.id ? 'location' : undefined}
                    onClick={(e) => go(e, h.id)}
                >
                    {h.text}
                </a>
            ))}
        </nav>
    )
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
    const active = useActiveHeading(headings)
    const [open, setOpen] = useState(false)
    if (!headings.length) return null

    return (
        <>
            <Box className="blog-toc-mobile" style={{ border: '1px solid var(--border)', borderRadius: 8 }} mb="lg">
                <UnstyledButton
                    onClick={() => setOpen((o) => !o)}
                    aria-expanded={open}
                    w="100%"
                    px="md"
                    py="sm"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 }}
                >
                    <Text fw={600} size="sm">
                        On this page
                    </Text>
                    <IconChevronDown
                        size={16}
                        style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    />
                </UnstyledButton>
                <Collapse in={open}>
                    <Box px="md" pb="sm">
                        <TocLinks headings={headings} active={active} onNavigate={() => setOpen(false)} />
                    </Box>
                </Collapse>
            </Box>
            <aside className="blog-toc-aside">
                <Text fw={600} size="xs" tt="uppercase" c="dimmed" mb="xs">
                    On this page
                </Text>
                <TocLinks headings={headings} active={active} />
            </aside>
        </>
    )
}
