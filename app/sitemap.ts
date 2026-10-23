import type { MetadataRoute } from 'next';
import { getPublishedSlugs } from '@/lib/blog';
import { supabase } from '@/lib/supabase';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

const STATIC_ROUTES = [
  '/',
  '/web-design-development',
  '/website-optimization',
  '/portfolio',
  '/blog',
  '/meteor-house',
  '/contact',
  '/booking',
  '/web-service-form',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, { data: projects, error }] = await Promise.all([
    getPublishedSlugs(),
    supabase.from('portfolio_items').select('id, updated_at').eq('is_visible', true),
  ]);
  if (error) throw error;

  return [
    ...STATIC_ROUTES.map((path) => ({ url: absoluteUrl(path) })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updated_at,
    })),
    ...(projects ?? []).map((project) => ({
      url: absoluteUrl(`/portfolio/${project.id}`),
      lastModified: project.updated_at,
    })),
  ];
}
