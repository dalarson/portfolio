import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (r) => r.required(),
        }),
        defineField({ name: 'description', type: 'text', rows: 2 }),
        defineField({
            name: 'displayOrder',
            type: 'number',
            description: 'Lower numbers appear first. Unordered categories follow, alphabetically.',
        }),
    ],
    orderings: [
        { title: 'Display order', name: 'order', by: [{ field: 'displayOrder', direction: 'asc' }] },
    ],
})
