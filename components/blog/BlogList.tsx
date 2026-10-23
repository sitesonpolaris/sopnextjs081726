'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogPostSummary } from '@/lib/blog';

export function BlogList({ posts }: { posts: BlogPostSummary[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
    return cats;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  return (
    <>
      <div className="mb-8 md:mb-12">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zero/40" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-2 border-zero/10 text-zero placeholder-zero/40 focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-fahrenheit transition-all duration-300"
            />
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 pb-2 min-w-max md:justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category
                      ? 'bg-fahrenheit text-white shadow-lg'
                      : 'bg-white text-zero border-2 border-zero/10 hover:border-fahrenheit hover:text-fahrenheit'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-2xl border border-zero/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
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
              <h2 className="mt-2 text-lg font-bold text-zero group-hover:text-fahrenheit transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zero/50 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-fahrenheit transition-all group-hover:gap-2">
                Read More
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-zero/50">
            {posts.length === 0
              ? 'No blog posts yet. Check back soon!'
              : 'No posts match your search. Try different keywords or select another category.'}
          </p>
          {posts.length > 0 && (
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 bg-fahrenheit hover:bg-fahrenheit/90 text-white"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </>
  );
}
