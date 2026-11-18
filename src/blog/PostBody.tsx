import { useMemo } from 'react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { Highlight, themes } from 'prism-react-renderer'
import { Alert, Badge, Box, Group, Text, Typography } from '@mantine/core'
import { IconAlertTriangle, IconBulb, IconInfoCircle, IconFlag } from '@tabler/icons-react'
import { imageSrcSet, imageUrl } from '../sanity/image'
import type { SanityImageSource } from '../sanity/types'
import { buildHeadingIds } from './headings'

type CalloutType = 'info' | 'tip' | 'warning' | 'important'

const CALLOUTS: Record<CalloutType, { color: string; icon: React.ReactNode; label: string }> = {
    info: { color: 'blue', icon: <IconInfoCircle size={18} />, label: 'Info' },
    tip: { color: 'teal', icon: <IconBulb size={18} />, label: 'Tip' },
    warning: { color: 'yellow', icon: <IconAlertTriangle size={18} />, label: 'Warning' },
    important: { color: 'red', icon: <IconFlag size={18} />, label: 'Important' },
}

function CodeBlock({ code, language, title }: { code: string; language?: string; title?: string }) {
    return (
        <Box my="lg" style={{ borderRadius: 8, overflow: 'hidden', background: '#1e1e2e' }}>
            <Group justify="space-between" px="md" py={6} style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Text size="xs" c="gray.4" ff="monospace" truncate>
                    {title ?? ''}
                </Text>
                {language && language !== 'text' && (
                    <Badge size="xs" variant="outline" color="gray">
                        {language === 'markup' ? 'html' : language}
                    </Badge>
                )}
            </Group>
            <Highlight theme={themes.vsDark} code={code.replace(/\n$/, '')} language={language ?? 'text'}>
                {({ tokens, getLineProps, getTokenProps, style }) => (
                    <pre
                        style={{
                            ...style,
                            background: 'transparent',
                            margin: 0,
                            padding: '12px 16px',
                            overflowX: 'auto',
                            fontSize: 14,
                            lineHeight: 1.6,
                            fontFamily: 'var(--mono)',
                        }}
                    >
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </Box>
    )
}

function imageDimensions(source: SanityImageSource) {
    const match = /-(\d+)x(\d+)-/.exec(source.asset?._ref ?? '')
    return match ? { width: Number(match[1]), height: Number(match[2]) } : null
}

function BlockImage({ image, alt, caption }: { image: SanityImageSource; alt?: string; caption?: string }) {
    if (!image?.asset) return null
    const dims = imageDimensions(image)
    return (
        <Box component="figure" my="xl" mx={0}>
            <img
                src={imageUrl(image, 800)}
                srcSet={imageSrcSet(image, [480, 800, 1200, 1600])}
                sizes="(max-width: 800px) 100vw, 800px"
                alt={alt ?? ''}
                loading="lazy"
                width={dims?.width}
                height={dims?.height}
                style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
            />
            {caption && (
                <Text component="figcaption" size="sm" c="dimmed" ta="center" mt="xs">
                    {caption}
                </Text>
            )}
        </Box>
    )
}

function youtubeId(input: string): string | null {
    if (/^[\w-]{11}$/.test(input)) return input
    try {
        const url = new URL(input)
        if (url.hostname.endsWith('youtu.be')) return url.pathname.slice(1, 12) || null
        const v = url.searchParams.get('v')
        if (v) return v
        const m = /\/(embed|shorts|live)\/([\w-]{11})/.exec(url.pathname)
        return m ? m[2] : null
    } catch {
        return null
    }
}

function createComponents(headingIds: Map<string, string>): PortableTextComponents {
    const heading =
        (Tag: 'h1' | 'h2' | 'h3' | 'h4') =>
        ({ children, value }: { children?: React.ReactNode; value: PortableTextBlock }) => (
            <Tag id={headingIds.get(value._key ?? '')} style={{ scrollMarginTop: 90 }}>
                {children}
            </Tag>
        )

    return {
        block: { h1: heading('h1'), h2: heading('h2'), h3: heading('h3'), h4: heading('h4') },
        marks: {
            link: ({ value, children }) => {
                const href: string = value?.href ?? ''
                const safe = /^(https?:|mailto:|\/)/.test(href)
                if (!safe) return <>{children}</>
                const external = value?.blank || /^https?:/.test(href)
                return (
                    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {children}
                    </a>
                )
            },
        },
        types: {
            codeBlock: ({ value }) => <CodeBlock code={value.code ?? ''} language={value.language} title={value.title} />,
            imageBlock: ({ value }) => <BlockImage image={value.image} alt={value.alt} caption={value.caption} />,
            callout: ({ value }) => {
                const c = CALLOUTS[value.type as CalloutType] ?? CALLOUTS.info
                return (
                    <Alert my="lg" color={c.color} icon={c.icon} title={c.label} variant="light">
                        <span style={{ whiteSpace: 'pre-wrap' }}>{value.text}</span>
                    </Alert>
                )
            },
            youtube: ({ value }) => {
                const id = youtubeId(value.url ?? '')
                if (!id) return null
                return (
                    <Box my="xl" style={{ position: 'relative', aspectRatio: '16 / 9' }}>
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${id}`}
                            title="YouTube video"
                            loading="lazy"
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, borderRadius: 8 }}
                        />
                    </Box>
                )
            },
            table: ({ value }) => {
                const rows: { _key: string; cells?: string[] }[] = value.rows ?? []
                if (!rows.length) return null
                const [head, ...body] = rows
                return (
                    <Box style={{ overflowX: 'auto' }} my="lg">
                        <table>
                            <thead>
                                <tr>
                                    {(head.cells ?? []).map((cell, i) => (
                                        <th key={i}>{cell}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {body.map((row) => (
                                    <tr key={row._key}>
                                        {(row.cells ?? []).map((cell, i) => (
                                            <td key={i}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                )
            },
            separator: () => <hr />,
        },
    }
}

export default function PostBody({ body }: { body: PortableTextBlock[] }) {
    const components = useMemo(() => createComponents(buildHeadingIds(body)), [body])
    return (
        <Typography className="blog-body">
            <PortableText value={body} components={components} />
        </Typography>
    )
}
