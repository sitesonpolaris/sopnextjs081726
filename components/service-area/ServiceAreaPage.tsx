import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  MapPin,
  Paintbrush,
  Search,
  ShoppingCart,
  Smartphone,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PostCard } from '@/components/blog/PostCard';
import { getPostsForPlace } from '@/lib/blog';
import { supabase } from '@/lib/supabase';
import { SERVICE_AREAS, type ServiceArea } from '@/lib/service-areas';
import { SITE_URL, absoluteUrl, jsonLd } from '@/lib/seo';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
}

const PROJECT_COLUMNS = 'id, title, category, description, image_url';

// Projects whose write-up mentions the city. Falls back to featured work when there are
// too few, and the section heading changes so it never claims those are local.
async function getProjects(city: string): Promise<{ projects: Project[]; local: boolean }> {
  const pattern = `%${city}%`;
  const { data: local, error } = await supabase
    .from('portfolio_items')
    .select(PROJECT_COLUMNS)
    .eq('is_visible', true)
    .or(['description', 'challenge', 'solution', 'results'].map((c) => `${c}.ilike.${pattern}`).join(','))
    .order('sort_order', { ascending: true })
    .limit(4);
  if (error) throw error;
  if (local && local.length >= 2) return { projects: local, local: true };

  const { data: featured, error: featuredError } = await supabase
    .from('portfolio_items')
    .select(PROJECT_COLUMNS)
    .eq('is_visible', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(4);
  if (featuredError) throw featuredError;
  return { projects: featured ?? [], local: false };
}

const included = [
  {
    icon: Paintbrush,
    title: 'Custom Design',
    desc: 'Built around your business, photos and customers, not a template shared with your competitors.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First and Fast',
    desc: 'Most local visitors are on a phone. Your site loads quickly and works well on every screen.',
  },
  {
    icon: Search,
    title: 'SEO Foundations',
    desc: 'Page titles, descriptions, structured data and a Google Business Profile link, set up from day one.',
  },
  {
    icon: ShoppingCart,
    title: 'Booking, Forms and Stores',
    desc: 'Online booking, quote requests, menus, event calendars and online stores when your business needs them.',
  },
  {
    icon: MessageCircle,
    title: 'Clear Calls to Action',
    desc: 'Every page leads somewhere: a call, a booking, a quote request or a sale.',
  },
  {
    icon: BarChart3,
    title: 'Ongoing Optimization',
    desc: 'Optional SEO and conversion work after launch, so the site keeps improving month over month.',
  },
];

export async function ServiceAreaPage({ area }: { area: ServiceArea }) {
  const [{ projects, local }, posts] = await Promise.all([
    getProjects(area.city),
    getPostsForPlace(area.blogTag),
  ]);
  const otherAreas = SERVICE_AREAS.filter((a) => a.slug !== area.slug);
  const url = absoluteUrl(`/${area.slug}`);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Web Design in ${area.city}, NC`,
      serviceType: 'Web design and development',
      description: area.metaDescription,
      url,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'City', name: `${area.city}, NC` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: `Web Design in ${area.city}, NC`, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: area.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-zero via-zero to-aluminum pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-4xl">
            <Badge className="bg-fahrenheit/20 text-fahrenheit border-fahrenheit/30 mb-6">
              <MapPin className="h-3 w-3 mr-1" />
              {area.city}, NC
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Web Design in {area.city}, NC
            </h1>
            <p className="mt-6 text-xl text-white/80 leading-relaxed">
              {area.heroIntro}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
                <Link href="/booking">
                  Get a Free Consultation
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Local context */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
            {area.localHeading}
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-zero/70">
            {area.localParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-fahrenheit">
              What You Get
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
              Websites Built to Bring In Business
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item) => (
              <div key={item.title} className="rounded-xl border border-zero/10 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                <div className="inline-flex rounded-lg bg-fahrenheit/10 p-2.5">
                  <item.icon className="h-5 w-5 text-fahrenheit" />
                </div>
                <h3 className="mt-3 font-bold text-zero">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zero/60">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-zero/60">
            Learn more about our{' '}
            <Link href="/web-design-development" className="font-semibold text-fahrenheit hover:underline">
              web design and development
            </Link>{' '}
            and{' '}
            <Link href="/website-optimization" className="font-semibold text-fahrenheit hover:underline">
              website optimization
            </Link>{' '}
            services.
          </p>
        </div>
      </section>

      {/* Work */}
      {projects.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-wider text-fahrenheit">
                {local ? `${area.city} Projects` : 'Recent Work'}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                {local ? `Websites We've Built in ${area.city}` : 'Real Results for Real Businesses'}
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.id}`}
                  className="group overflow-hidden rounded-2xl border border-zero/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    {project.image_url && (
                      <Image
                        src={project.image_url}
                        alt={`${project.title} website`}
                        fill
                        sizes="(min-width: 1280px) 600px, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-2 bg-zero/5 text-zero/50 text-xs">
                      {project.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-zero group-hover:text-fahrenheit transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zero/60 line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-4">
            {area.faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-zero/10 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-zero">{faq.question}</h3>
                <p className="mt-2 leading-relaxed text-zero/70">{faq.answer}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-zero/60">
            For a full breakdown of pricing, read{' '}
            <Link href="/blog/small-business-website-cost-gastonia-charlotte" className="font-semibold text-fahrenheit hover:underline">
              what a small business website costs in Gastonia and Charlotte
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
              Insights for {area.city} Businesses
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-zero py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready for a Website That Works as Hard as You Do?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Schedule a free consultation and get a straight quote for your {area.city} business.
          </p>
          <Button asChild className="mt-8 bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
            <Link href="/booking">
              Schedule Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {otherAreas.length > 0 && (
            <p className="mt-8 text-sm text-white/50">
              Also serving{' '}
              {otherAreas.map((other, i) => (
                <span key={other.slug}>
                  {i > 0 && ', '}
                  <Link href={`/${other.slug}`} className="text-white/80 underline hover:text-white">
                    {other.city}, NC
                  </Link>
                </span>
              ))}{' '}
              and all of Gaston County.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
