'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, Star, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;

  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1`;
  }

  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1`;
  }

  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return url;
  }

  return null;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  challenge?: string;
  solution?: string;
  results?: string;
  tags: string[];
  video_url?: string;
  thumbnail_url: string;
  live_url: string;
  is_featured: boolean;
  client_name?: string;
  project_year?: string;
}

export default function PortfolioDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('id', params.slug)
        .eq('is_visible', true)
        .maybeSingle();

      if (data) {
        setProject({
          id: data.id,
          title: data.title,
          slug: data.id,
          category: data.category,
          description: data.description,
          challenge: data.challenge,
          solution: data.solution,
          results: data.results,
          tags: data.tech_stack || [],
          video_url: data.video_url,
          thumbnail_url: data.image_url || '',
          live_url: data.website_url || '',
          is_featured: data.is_featured || false,
          client_name: data.client_name,
          project_year: data.project_year
        });
      }
      setLoading(false);
    }
    fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] pt-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 rounded bg-zero/10" />
            <div className="h-12 w-3/4 rounded bg-zero/10" />
            <div className="h-96 rounded-2xl bg-zero/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f8f8]">
        <h1 className="text-2xl font-bold text-zero">Project Not Found</h1>
        <p className="mt-2 text-zero/60">The project you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild className="mt-6 bg-fahrenheit hover:bg-fahrenheit/90 text-white">
          <Link href="/portfolio">Back to Portfolio</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <section className="bg-white pt-32 pb-16">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            href="/portfolio"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zero/60 transition-colors hover:text-zero"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-zero/10 text-zero/70">
              {project.category}
            </Badge>
            {project.is_featured && (
              <Badge className="bg-fahrenheit text-white border-0 gap-1">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-zero sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zero/60">{project.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f8f8] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="overflow-hidden rounded-2xl border border-zero/10 shadow-lg bg-zero/5">
            {project.video_url && getVideoEmbedUrl(project.video_url) ? (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {getVideoEmbedUrl(project.video_url)!.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video
                    autoPlay
                    muted
                    loop
                    controls
                    className="absolute inset-0 h-full w-full"
                    src={getVideoEmbedUrl(project.video_url)!}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={getVideoEmbedUrl(project.video_url)!}
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />  
                )}
              </div>
            ) : project.thumbnail_url ? (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full object-cover"
                style={{ maxHeight: '600px' }}
              />
            ) : null}
          </div>

          {(project.challenge || project.solution || project.results) && (
            <div className="mt-12 space-y-6">
              <h2 className="text-3xl font-bold text-zero">About This Project</h2>

              {project.challenge && (
                <div className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-lg bg-red-50 p-3">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-zero mb-3">Challenge</h3>
                      <p className="text-lg leading-relaxed text-zero/70">
                        {project.challenge}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {project.solution && (
                <div className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-lg bg-blue-50 p-3">
                      <Lightbulb className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-zero mb-3">Solution</h3>
                      <p className="text-lg leading-relaxed text-zero/70">
                        {project.solution}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {project.results && (
                <div className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-lg bg-green-50 p-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-zero mb-3">Results</h3>
                      <p className="text-lg leading-relaxed text-zero/70">
                        {project.results}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {project.live_url && (
            <div className="mt-8">
              <Button asChild className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  Visit Live Site
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-zero py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Like What You See?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Schedule a strategy consultation to discuss your project goals.
          </p>
          <Button asChild className="mt-8 bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
            <Link href="/booking">
              Schedule Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
