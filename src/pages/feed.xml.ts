import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSortedPosts } from '../utils/posts';
import { render } from 'astro:content';

export async function GET(context: APIContext) {
  if (!context.site) {
    return new Response('Site URL not configured', { status: 500 });
  }

  const posts = await getSortedPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/writing/${post.id}`,
        content: post.body,
      };
    })
  );

  return rss({
    title: "Rajat's Blog",
    description: 'Essays on building AI products, leading engineering teams, and the path from frontend to AI leadership.',
    site: context.site.toString(),
    items,
  });
}
