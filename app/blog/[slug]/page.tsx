'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
  category: string;
  read_time: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.slug)
        .eq('published', true)
        .maybeSingle();
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] pt-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-32 rounded bg-zero/10" />
            <div className="h-10 w-3/4 rounded bg-zero/10" />
            <div className="h-80 rounded-2xl bg-zero/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f8f8]">
        <h1 className="text-2xl font-bold text-zero">Post Not Found</h1>
        <p className="mt-2 text-zero/60">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild className="mt-6 bg-fahrenheit hover:bg-fahrenheit/90 text-white">
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const paragraphs = post.content.split('\n\n');

  return (
    <>
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
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f8f8] py-16">
        <div className="mx-auto max-w-3xl px-6">
          {post.image_url && (
            <div className="mb-12 overflow-hidden rounded-2xl border border-zero/10 shadow-lg">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full object-cover"
                style={{ maxHeight: '500px' }}
              />
            </div>
          )}

          <article className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm sm:p-12">
            <div className="prose prose-lg max-w-none">
              {paragraphs.map((paragraph, idx) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2
                      key={idx}
                      className="mt-10 mb-4 text-2xl font-bold text-zero first:mt-0"
                    >
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <p key={idx} className="mb-4 font-bold text-zero">
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={idx} className="mb-6 space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-zero/70">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-fahrenheit" />
                          {item.replace('- ', '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.startsWith('**') && paragraph.includes(':')) {
                  const [bold, rest] = paragraph.split('**:');
                  return (
                    <p key={idx} className="mb-4 text-lg leading-relaxed text-zero/70">
                      <strong className="text-zero">{bold.replace(/\*\*/g, '')}:</strong>
                      {rest?.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                return (
                  <p key={idx} className="mb-4 text-lg leading-relaxed text-zero/70">
                    {paragraph}
                  </p>
                );
              })}
            </div>
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
    </>
  );
}
