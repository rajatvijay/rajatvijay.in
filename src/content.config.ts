import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    readTime: z.number(),
    featured: z.boolean().default(false),
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
    color: z.string(),
    techStack: z.array(z.string()),
    featured: z.boolean().default(false),
    problem: z.string(),
    approach: z.string(),
    impact: z.array(z.object({ metric: z.string(), label: z.string() })),
    decisions: z.array(z.object({ title: z.string(), detail: z.string() })),
  }),
});

export const collections = { blog, projects };
