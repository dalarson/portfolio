import { defineField, defineType } from 'sanity'

export const upcomingProjectType = defineType({
    name: 'upcomingProject',
    title: 'Up-and-Coming Project',
    type: 'document',
    fields: [
        defineField({
            name: 'hidden',
            title: 'Hide from site',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Short Description',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Photo (optional)',
            type: 'image',
            options: { hotspot: true },
            fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers first.',
        }),
    ],
    preview: { select: { title: 'title', media: 'image' } },
})
