import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = { params: { slug: string }; children: React.ReactNode };

// Portfolio URLs use the item id as the slug.
async function getProject(id: string) {
  if (!UUID_RE.test(id)) return null;
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('id, title, category, description, image_url')
    .eq('id', id)
    .eq('is_visible', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return {};

  return pageMetadata({
    title: `${project.title}: ${project.category} Project`,
    description: project.description,
    path: `/portfolio/${project.id}`,
    image: project.image_url || undefined,
  });
}

export default async function Layout({ params, children }: Props): Promise<JSX.Element> {
  if (!(await getProject(params.slug))) notFound();
  return <>{children}</>;
}
