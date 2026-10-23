import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublishedPost, getPublishedSlugs, getRelatedPosts } from '@/lib/blog';
import { PostCard } from '@/components/blog/PostCard';
import { DEFAULT_OG_IMAGE, LOGO_URL, SITE_NAME, absoluteUrl, jsonLd } from '@/lib/seo';

export const revalidate = 3600;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const posts = await getPublishedSlugs();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost(params.slug);
  if (!post) return {};

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;
  const path = `/blog/${post.slug}`;
  const image = post.image_url || DEFAULT_OG_IMAGE;

  return {
    // seo_title is written as the full title tag, so skip the site-name template.
    title: post.seo_title ? { absolute: post.seo_title } : post.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPublishedPost(params.slug);
  if (!post) notFound();
  const relatedPosts = await getRelatedPosts(post);

  const url = absoluteUrl(`/blog/${post.slug}`);
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.seo_description || post.excerpt,
      image: post.image_url || DEFAULT_OG_IMAGE,
      datePublished: post.created_at,
      dateModified: post.updated_at,
      author: { '@type': 'Person', name: post.author },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: { '@type': 'ImageObject', url: LOGO_URL },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />

      <section className="bg-white pt-32 pb-16">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zero/60 transition-colors hover:text-zero"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-6 text-sm text-zero/50">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'America/New_York',
                })}
              </time>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f8f8] py-16">
        <div className="mx-auto max-w-3xl px-6">
          {post.image_url && (
            <div className="mb-12 overflow-hidden rounded-2xl border border-zero/10 shadow-lg">
              <Image
                src={post.image_url}
                alt={post.title}
                width={1200}
                height={630}
                sizes="(min-width: 768px) 720px, 100vw"
                priority
                className="w-full h-auto object-cover"
                style={{ maxHeight: '500px' }}
              />
            </div>
          )}

          <article className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm sm:p-12">
            <div
              className="blog-content max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          <div className="mt-12 rounded-2xl border border-zero/10 bg-white p-8 shadow-sm text-center">
            <h3 className="text-xl font-bold text-zero">Enjoyed this article?</h3>
            <p className="mt-2 text-zero/60">
              Schedule a consultation to discuss how these insights apply to your business.
            </p>
            <Button asChild className="mt-4 bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
              <Link href="/booking">
                Schedule Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-zero sm:text-3xl">
              Keep Reading
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <PostCard key={related.id} post={related} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
