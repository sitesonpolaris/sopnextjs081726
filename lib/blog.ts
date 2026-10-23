import { supabase } from '@/lib/supabase';

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  author: string;
  created_at: string;
  category: string;
  read_time: string;
  featured: boolean;
  tags: string[] | null;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
}

const SUMMARY_COLUMNS =
  'id, title, slug, excerpt, image_url, author, created_at, category, read_time, featured, tags';

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(SUMMARY_COLUMNS)
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPublishedSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true);
  if (error) throw error;
  return data ?? [];
}

// Other published posts ranked by shared category, then shared tags, then recency.
export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPostSummary[]> {
  const tags = new Set(post.tags ?? []);
  const score = (p: BlogPostSummary) =>
    (p.category === post.category ? 10 : 0) + (p.tags ?? []).filter((t) => tags.has(t)).length;

  const posts = await getPublishedPosts();
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p, recency) => ({ p, s: score(p), recency }))
    .sort((a, b) => b.s - a.s || a.recency - b.recency)
    .slice(0, limit)
    .map(({ p }) => p);
}

// Published posts tagged with a place (e.g. "Gastonia NC"), newest first, topped up with
// the latest posts when there aren't enough tagged ones.
export async function getPostsForPlace(tag: string, limit = 3): Promise<BlogPostSummary[]> {
  const posts = await getPublishedPosts();
  const tagged = posts.filter((p) => p.tags?.includes(tag));
  const rest = posts.filter((p) => !p.tags?.includes(tag));
  return [...tagged, ...rest].slice(0, limit);
}
