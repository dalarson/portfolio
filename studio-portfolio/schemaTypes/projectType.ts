import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'project',
    title: 'Project Showcase',
    type: 'document',
    fields: [
        // 1. Basic Info
        defineField({
            name: 'title',
            title: 'Project Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Short Description',
            type: 'text',
            rows: 3,
            description: 'A brief overview for the project card.',
        }),

        // 2. Project Classification
        defineField({
            name: 'projectType',
            title: 'Project Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Cloud Deployed', value: 'cloud' },
                    { title: 'GitHub Repository Only', value: 'repo' },
                ],
                layout: 'radio',
            },
            initialValue: 'cloud',
        }),

        // 3. Technical Metadata
        defineField({
            name: 'techStack',
            title: 'Technologies Used',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags', // Allows for easy tag-style input
            },
        }),

        // 4. Links & Demos
        defineField({
            name: 'githubUrl',
            title: 'GitHub Repository URL',
            type: 'url',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'liveUrl',
            title: 'Live Demo URL',
            type: 'url',
            description: 'The URL of the deployed application.',
            hidden: ({ document }) => document?.projectType === 'repo',
        }),

        // 5. Visuals
        defineField({
            name: 'mainImage',
            title: 'Main Project Image',
            type: 'image',
            options: {
                hotspot: true, // Allows you to crop images directly in the CMS
            },
        }),

        // 6. Featured Order
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Used to sort projects on the frontend (lower numbers first).',
        }),
    ],
});