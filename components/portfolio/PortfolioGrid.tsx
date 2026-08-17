'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { PortfolioFilter } from './PortfolioFilter';

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

export function PortfolioGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data } = await supabase
        .from('portfolio_items')
        .select('id, title, category, description, tech_stack, image_url, is_featured, is_visible')
        .eq('is_visible', true)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true });

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
      setLoading(false);
    }
    fetchProjects();
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <PortfolioFilter active={filter} onChange={setFilter} />

      {loading ? (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-zero/10 bg-white">
              <div className="h-56 bg-zero/5" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-20 rounded bg-zero/10" />
                <div className="h-5 w-3/4 rounded bg-zero/10" />
                <div className="h-4 w-full rounded bg-zero/5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group overflow-hidden rounded-2xl border border-zero/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zero/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {project.is_featured && (
                  <div className="absolute left-3 top-3">
                    <Badge className="bg-fahrenheit text-white border-0 gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zero opacity-0 shadow-lg transition-all group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              <div className="p-5">
                <Badge variant="secondary" className="mb-2 bg-zero/5 text-zero/50 text-xs">
                  {project.category}
                </Badge>
                <h3 className="text-lg font-bold text-zero group-hover:text-fahrenheit transition-colors">
                  {project.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zero/50 line-clamp-2">
                  {project.description}
                </p>
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
      )}

      {!loading && filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg text-zero/50">No projects found in this category.</p>
        </div>
      )}
    </div>
  );
}
