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
}

export interface BlogPost extends BlogPostSummary {
  content: string;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
}

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, image_url, author, created_at, category, read_time, featured')
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
