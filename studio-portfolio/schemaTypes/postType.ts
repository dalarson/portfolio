import { defineField, defineType } from 'sanity'

export const postType = defineType({
    name: 'post',
    title: 'Post',
    type: 'document',
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'metadata', title: 'Metadata' },
        { name: 'seo', title: 'SEO' },
    ],
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            group: 'content',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            group: 'content',
            options: { source: 'title', maxLength: 96 },
            description: 'Used in the URL (/blog/slug). Keep stable after publishing.',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'excerpt',
            type: 'text',
            rows: 3,
            group: 'content',
            validation: (r) => r.required().max(300),
        }),
        defineField({
            name: 'coverImage',
            type: 'image',
            group: 'content',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                }),
            ],
        }),
        defineField({
            name: 'body',
            type: 'blogBody',
            group: 'content',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'publishedAt',
            type: 'datetime',
            group: 'metadata',
            initialValue: () => new Date().toISOString(),
            validation: (r) => r.required(),
        }),
        defineField({ name: 'updatedAt', type: 'datetime', group: 'metadata' }),
        defineField({
            name: 'featured',
            type: 'boolean',
            group: 'metadata',
            initialValue: false,
            description: 'If several posts are featured, the most recently published is shown.',
        }),
        defineField({
            name: 'categories',
            type: 'array',
            group: 'metadata',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
            validation: (r) => r.required().min(1),
        }),
        defineField({
            name: 'tags',
            type: 'array',
            group: 'metadata',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
        }),
        defineField({
            name: 'author',
            type: 'string',
            group: 'metadata',
            initialValue: 'David Larson',
        }),
        defineField({
            name: 'seoTitle',
            type: 'string',
            group: 'seo',
            validation: (r) => r.max(60),
        }),
        defineField({
            name: 'seoDescription',
            type: 'text',
            rows: 3,
            group: 'seo',
            validation: (r) => r.max(160),
        }),
    ],
    orderings: [
        {
            title: 'Published date, newest first',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
    preview: {
        select: { title: 'title', date: 'publishedAt', media: 'coverImage', category: 'categories.0.title' },
        prepare: ({ title, date, media, category }) => ({
            title,
            media,
            subtitle: [date ? new Date(date).toLocaleDateString() : 'No date', category]
                .filter(Boolean)
                .join(' · '),
        }),
    },
})
