import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSortedPosts } from '../utils/posts';

export async function GET(context: APIContext) {
  if (!context.site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  const posts = await getSortedPosts();

  return rss({
    title: "Rajat's Blog",
    description: 'Essays on building AI products, leading engineering teams, and the path from frontend to AI leadership.',
    site: context.site.toString(),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/writing/${post.id}`,
      content: post.body,
    })),
  });
}
