import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a hex color like #D85A30');

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
    role: z.string(),
    timeline: z.string(),
    team: z.string(),
    color: hexColor,
    techStack: z.array(z.string()),
    featured: z.boolean().default(false),
    problem: z.string(),
    approach: z.string(),
    impact: z.array(z.object({ metric: z.string(), label: z.string() })),
    decisions: z.array(z.object({ title: z.string(), detail: z.string() })).optional(),
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
    youtubeId: z.string().default(''),
    slidesUrl: z.string().default(''),
    description: z.string(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    color: hexColor,
    icon: z.string().default(''),
    type: z.enum(['web', 'mobile', 'oss', 'template', 'download']),
    pricing: z.enum(['free', 'freemium', 'paid', 'subscription']),
    url: z.string().url(),
    featured: z.boolean().default(false),
    techStack: z.array(z.string()).default([]),
    status: z.enum(['live', 'beta', 'coming-soon']).default('live'),
  }),
});

export const collections = { blog, projects, talks, products };
