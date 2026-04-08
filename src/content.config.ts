import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a hex color like #D85A30');
const youtubeIdFormat = z.string().regex(/^[a-zA-Z0-9_-]{0,11}$/).default('');

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    readTime: z.number().positive().int(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    tldr: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string().optional(),
    url: z.union([z.string().url(), z.literal('')]).default(''),
    github: z.union([z.string().url(), z.literal('')]).default(''),
    techStack: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks' }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    duration: z.string(),
    featured: z.boolean().default(false),
    youtubeId: youtubeIdFormat,
    slidesUrl: z.union([z.string().url(), z.literal('')]).default(''),
    description: z.string(),
  }),
});


export const collections = { blog, projects, talks };
