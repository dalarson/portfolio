import { defineArrayMember, defineField, defineType } from 'sanity'

const LANGUAGES = [
    { title: 'TypeScript', value: 'typescript' },
    { title: 'TSX', value: 'tsx' },
    { title: 'JavaScript', value: 'javascript' },
    { title: 'JSON', value: 'json' },
    { title: 'Bash', value: 'bash' },
    { title: 'Python', value: 'python' },
    { title: 'SQL', value: 'sql' },
    { title: 'CSS', value: 'css' },
    { title: 'HTML', value: 'markup' },
    { title: 'YAML', value: 'yaml' },
    { title: 'Markdown', value: 'markdown' },
    { title: 'Plain text', value: 'text' },
]

export const codeBlockType = defineType({
    name: 'codeBlock',
    title: 'Code Block',
    type: 'object',
    fields: [
        defineField({ name: 'title', type: 'string', description: 'Optional, e.g. a file name.' }),
        defineField({
            name: 'language',
            type: 'string',
            options: { list: LANGUAGES },
            initialValue: 'typescript',
            validation: (r) => r.required(),
        }),
        defineField({ name: 'code', type: 'text', rows: 10, validation: (r) => r.required() }),
    ],
    preview: {
        select: { title: 'title', subtitle: 'language' },
        prepare: ({ title, subtitle }) => ({ title: title || 'Code block', subtitle }),
    },
})

export const imageBlockType = defineType({
    name: 'imageBlock',
    title: 'Image',
    type: 'object',
    fields: [
        defineField({
            name: 'image',
            type: 'image',
            options: { hotspot: true },
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'alt',
            title: 'Alternative text',
            type: 'string',
            validation: (r) => r.required(),
        }),
        defineField({ name: 'caption', type: 'string' }),
    ],
    preview: {
        select: { title: 'caption', subtitle: 'alt', media: 'image' },
        prepare: ({ title, subtitle, media }) => ({ title: title || subtitle || 'Image', media }),
    },
})

export const calloutType = defineType({
    name: 'callout',
    title: 'Callout',
    type: 'object',
    fields: [
        defineField({
            name: 'type',
            type: 'string',
            options: {
                list: [
                    { title: 'Info', value: 'info' },
                    { title: 'Tip', value: 'tip' },
                    { title: 'Warning', value: 'warning' },
                    { title: 'Important', value: 'important' },
                ],
                layout: 'radio',
            },
            initialValue: 'info',
            validation: (r) => r.required(),
        }),
        defineField({ name: 'text', type: 'text', rows: 3, validation: (r) => r.required() }),
    ],
    preview: {
        select: { title: 'text', subtitle: 'type' },
    },
})

export const youtubeType = defineType({
    name: 'youtube',
    title: 'YouTube Embed',
    type: 'object',
    fields: [
        defineField({
            name: 'url',
            title: 'Video URL or ID',
            type: 'string',
            validation: (r) =>
                r.required().custom((value) => {
                    if (!value) return true
                    const ok =
                        /^[\w-]{11}$/.test(value) ||
                        /^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//.test(value)
                    return ok || 'Enter a YouTube URL or an 11-character video ID'
                }),
        }),
    ],
    preview: { select: { title: 'url' }, prepare: ({ title }) => ({ title, subtitle: 'YouTube' }) },
})

export const tableType = defineType({
    name: 'table',
    title: 'Table',
    type: 'object',
    description: 'The first row is used as the header.',
    fields: [
        defineField({
            name: 'rows',
            type: 'array',
            validation: (r) => r.required().min(1),
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'tableRow',
                    fields: [
                        defineField({
                            name: 'cells',
                            type: 'array',
                            of: [{ type: 'string' }],
                        }),
                    ],
                    preview: {
                        select: { cells: 'cells' },
                        prepare: ({ cells }) => ({ title: (cells || []).join(' | ') }),
                    },
                }),
            ],
        }),
    ],
    preview: {
        select: { rows: 'rows' },
        prepare: ({ rows }) => ({ title: 'Table', subtitle: `${(rows || []).length} rows` }),
    },
})

export const separatorType = defineType({
    name: 'separator',
    title: 'Separator',
    type: 'object',
    fields: [defineField({ name: 'style', type: 'string', hidden: true, initialValue: 'line' })],
    preview: { prepare: () => ({ title: '— Horizontal separator —' }) },
})

export const blogBodyType = defineType({
    name: 'blogBody',
    title: 'Body',
    type: 'array',
    of: [
        defineArrayMember({
            type: 'block',
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H1', value: 'h1' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
            ],
            lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
            ],
            marks: {
                decorators: [
                    { title: 'Bold', value: 'strong' },
                    { title: 'Italic', value: 'em' },
                    { title: 'Code', value: 'code' },
                ],
                annotations: [
                    {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                            defineField({
                                name: 'href',
                                type: 'url',
                                validation: (r) =>
                                    r
                                        .required()
                                        .uri({ scheme: ['http', 'https', 'mailto'], allowRelative: false }),
                            }),
                            defineField({ name: 'blank', title: 'Open in new tab', type: 'boolean' }),
                        ],
                    },
                ],
            },
        }),
        defineArrayMember({ type: 'codeBlock' }),
        defineArrayMember({ type: 'imageBlock' }),
        defineArrayMember({ type: 'callout' }),
        defineArrayMember({ type: 'youtube' }),
        defineArrayMember({ type: 'table' }),
        defineArrayMember({ type: 'separator' }),
    ],
})
