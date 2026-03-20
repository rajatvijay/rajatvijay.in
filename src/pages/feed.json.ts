import type { APIContext } from 'astro';
import { getSortedPosts } from '../utils/posts';

export async function GET(context: APIContext) {
  if (!context.site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  const posts = await getSortedPosts();

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: "Rajat's Blog",
    home_page_url: context.site.toString(),
    feed_url: new URL('/feed.json', context.site).toString(),
    description: 'Essays on building AI products, leading engineering teams, and the path from frontend to AI leadership.',
    items: posts.map(post => ({
      id: new URL(`/writing/${post.id}`, context.site).toString(),
      url: new URL(`/writing/${post.id}`, context.site).toString(),
      title: post.data.title,
      summary: post.data.description,
      date_published: post.data.date.toISOString(),
      tags: post.data.tags,
    })),
  };

  return new Response(JSON.stringify(feed), {
    headers: { 'Content-Type': 'application/json' },
  });
}
