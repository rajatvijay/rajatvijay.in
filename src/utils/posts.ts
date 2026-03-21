import { getCollection } from 'astro:content';

export async function getSortedPosts() {
  const posts = await getCollection('blog');
  return posts
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
