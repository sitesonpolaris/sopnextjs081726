'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  tags: string[];
  thumbnail_url: string;
  is_featured: boolean;
}

export function PortfolioShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('portfolio_items')
        .select('id, title, category, description, tech_stack, image_url, is_featured, is_visible')
        .eq('is_visible', true)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .limit(12);

      if (data) {
        const mappedProjects = data.map(item => ({
          id: item.id,
          title: item.title,
          slug: item.id,
          category: item.category,
          description: item.description,
          tags: item.tech_stack || [],
          thumbnail_url: item.image_url || '',
          is_featured: item.is_featured || false
        }));
        setProjects(mappedProjects);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-fahrenheit">
              Our Work
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zero sm:text-4xl lg:text-5xl">
              Featured Portfolio
            </h2>
            <p className="mt-3 max-w-xl text-lg text-zero/60">
              Real results for real businesses. See how we&apos;ve helped our clients grow their
              digital presence.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 border-zero/20 text-zero hover:bg-zero/5">
            <Link href="/portfolio">
              View All Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

          <div className="flex overflow-hidden">
            <div className="animate-marquee flex shrink-0 gap-6">
              {[...projects, ...projects].map((project, idx) => (
                <Link
                  key={`${project.id}-${idx}`}
                  href={`/portfolio/${project.slug}`}
                  className="group relative w-[340px] shrink-0 overflow-hidden rounded-2xl border border-zero/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zero/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    {project.is_featured && (
                      <div className="absolute left-3 top-3">
                        <Badge className="bg-fahrenheit text-white border-0 gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <Badge variant="secondary" className="mb-2 bg-zero/5 text-zero/60 text-xs">
                      {project.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-zero">{project.title}</h3>
                    <p className="mt-1 text-sm text-zero/50 line-clamp-2">{project.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-aluminum/10 px-2.5 py-0.5 text-xs font-medium text-aluminum"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
