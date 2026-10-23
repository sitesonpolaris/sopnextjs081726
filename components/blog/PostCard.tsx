import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';
import type { BlogPostSummary } from '@/lib/blog';

export function PostCard({
  post,
  headingLevel: Heading = 'h2',
}: {
  post: BlogPostSummary;
  headingLevel?: 'h2' | 'h3';
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-2xl border border-zero/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-52 overflow-hidden">
        {post.image_url && (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-zero/40">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            // Fixed zone so the server-rendered date matches hydration in any browser.
            timeZone: 'America/New_York',
          })}
        </div>
        <Heading className="mt-2 text-lg font-bold text-zero group-hover:text-fahrenheit transition-colors line-clamp-2">
          {post.title}
        </Heading>
        <p className="mt-2 text-sm leading-relaxed text-zero/50 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-fahrenheit transition-all group-hover:gap-2">
          Read More
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
