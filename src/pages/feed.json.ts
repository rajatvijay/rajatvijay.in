import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: "Rajat's Blog",
    home_page_url: context.site!.toString(),
    feed_url: new URL('/feed.json', context.site!).toString(),
    description: 'Essays on building AI products, leading engineering teams, and the path from frontend to AI leadership.',
    items: posts.map(post => ({
      id: new URL(`/writing/${post.id}/`, context.site!).toString(),
      url: new URL(`/writing/${post.id}/`, context.site!).toString(),
      title: post.data.title,
      summary: post.data.description,
      date_published: post.data.date.toISOString(),
      tags: post.data.tags,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
