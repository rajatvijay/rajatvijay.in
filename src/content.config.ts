import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a hex color like #D85A30');
const youtubeIdFormat = z.string().regex(/^[a-zA-Z0-9_-]{0,11}$/).default('');

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
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
    subtitle: z.string(),
    color: hexColor,
    techStack: z.array(z.string()),
    featured: z.boolean().default(false),
    impact: z.array(z.object({ metric: z.string(), label: z.string() })),
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

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    type: z.enum(['web', 'mobile', 'oss', 'template', 'download']),
    url: z.string().url(),
    featured: z.boolean().default(false),
    status: z.enum(['live', 'beta', 'coming-soon']).default('live'),
  }),
});

export const collections = { blog, projects, talks, products };
