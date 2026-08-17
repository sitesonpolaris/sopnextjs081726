'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Paintbrush,
  Code2,
  Layout,
  Smartphone,
  Target,
  Database,
  Globe,
  ShoppingCart,
  CheckCircle2,
  Sparkles,
  Eye,
  Zap,
  BarChart3,
  Search,
  Users,
  Accessibility,
  Star,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  is_featured: boolean;
  client_results?: string;
}

export default function WebDesignDevelopmentPage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_visible', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(4);

      if (data) {
        setFeaturedProjects(data);
      }
    }
    fetchProjects();
  }, []);

  return (
    <>
      {/* Hero Section */}
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
              <Sparkles className="h-3 w-3 mr-1" />
              Web Design & Development
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Websites That Drive Real Business Results
            </h1>
            <p className="mt-6 text-xl text-white/80 leading-relaxed">
              We create high-performing websites that combine stunning design with powerful functionality. From initial concept to ongoing optimization, we build digital experiences that convert visitors into customers.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
                <Link href="/booking">
                  Start Your Project
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

      {/* Featured Projects Showcase */}
      {featuredProjects.length > 0 && (
        <section className="bg-[#f8f8f8] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-wider text-fahrenheit">
                Recent Work
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                Real Results for Real Businesses
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.id}`}
                  className="group overflow-hidden rounded-2xl border border-zero/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zero/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute left-3 top-3">
                      <Badge className="bg-fahrenheit text-white border-0 gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-2 bg-zero/5 text-zero/50 text-xs">
                      {project.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-zero group-hover:text-fahrenheit transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zero/60">
                      {project.description}
                    </p>
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tech_stack.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-aluminum/10 px-3 py-1 text-xs font-medium text-aluminum"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What Makes a Website Successful */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12 items-center">
            <div className="lg:col-span-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=80"
                  alt="Modern website design on laptop"
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                  What Makes a Website Successful?
                </h2>
                <p className="mt-4 text-lg text-zero/60">
                  A great website is more than just good looks. It's a strategic combination of <span className="font-semibold text-fahrenheit">design, technology, and optimization.</span>
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Search, title: 'SEO Optimized', desc: 'Built for search engines from the ground up with clean code and strategic content.' },
                  { icon: Layout, title: 'Modern CMS', desc: 'Easy-to-use content management systems that give you full control.' },
                  { icon: Accessibility, title: 'Accessible Design', desc: 'WCAG compliant designs that work for everyone, everywhere.' },
                  { icon: BarChart3, title: 'Analytics Ready', desc: 'Track what matters with integrated analytics and conversion tracking.' },
                  { icon: Database, title: 'CRM Integration', desc: 'Seamlessly connect with your existing business tools and workflows.' },
                  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized performance that keeps visitors engaged and search engines happy.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-zero/10 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="inline-flex rounded-lg bg-fahrenheit/10 p-2.5">
                      <item.icon className="h-5 w-5 text-fahrenheit" />
                    </div>
                    <h3 className="mt-3 font-bold text-zero text-sm">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-zero/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Ready Websites */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <Badge className="bg-fahrenheit/20 text-fahrenheit border-fahrenheit/30 mb-4">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Ready Design
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                  Built for the AI Era
                </h2>
                <p className="mt-4 text-lg text-zero/60">
                  Your website needs to <span className="font-semibold text-fahrenheit">work for both humans and AI.</span> We create sites that are discoverable, understood, and recommended by AI systems.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'AI-Powered Research',
                    desc: 'Deep analysis of your brand, competitors, and industry using AI-driven insights.',
                  },
                  {
                    title: 'AI-Ready Structure',
                    desc: 'Semantic markup and structured data that AI systems can easily understand and index.',
                  },
                  {
                    title: 'AI-Optimized Content',
                    desc: 'Content that ranks in traditional search and surfaces in AI-powered answers.',
                  },
                  {
                    title: 'AI Analytics',
                    desc: 'Track your performance across search engines and AI platforms like ChatGPT and Perplexity.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative rounded-xl border border-zero/10 bg-white p-5">
                    <div className="text-3xl font-bold text-fahrenheit/20 mb-2">0{idx + 1}</div>
                    <h3 className="text-base font-bold text-zero mb-1.5">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-zero/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/AI%20pic.JPG"
                  alt="AI technology and neural networks"
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Conversion Design */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex rounded-xl bg-fahrenheit/10 p-3">
                <Paintbrush className="h-7 w-7 text-fahrenheit" />
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                High-Conversion Design
              </h2>
              <p className="mt-2 text-lg font-medium text-fahrenheit">Design that drives results, not just looks.</p>
              <p className="mt-4 text-lg leading-relaxed text-zero/60">
                Every pixel is strategically placed to guide visitors toward action. We combine stunning visuals with data-driven UX principles to create websites that convert browsers into buyers.
              </p>
              <Button asChild className="mt-8 bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
                <Link href="/booking">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Layout, label: 'Strategic UX/UI Design', desc: 'User journeys optimized for conversion with intuitive navigation and clear CTAs.' },
                { icon: Smartphone, label: 'Responsive Development', desc: 'Flawless experiences across all devices from mobile to ultrawide displays.' },
                { icon: Target, label: 'Landing Page Design', desc: 'High-converting landing pages built for paid campaigns and organic traffic.' },
                { icon: Paintbrush, label: 'Brand Integration', desc: 'Seamless brand consistency from logo to layout, creating memorable digital experiences.' },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="rounded-xl border border-fahrenheit/20 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="inline-flex rounded-lg bg-fahrenheit/10 p-2">
                    <feature.icon className="h-5 w-5 text-fahrenheit" />
                  </div>
                  <h3 className="mt-3 font-bold text-zero">{feature.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zero/50">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Development */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="grid gap-4 sm:grid-cols-2 lg:order-1">
              {[
                { icon: Code2, label: 'React / Next.js', desc: 'Modern, component-based frontend architecture for fast, interactive experiences.' },
                { icon: Database, label: 'Supabase Backend', desc: 'Real-time database, authentication, and serverless functions out of the box.' },
                { icon: Globe, label: 'API Integrations', desc: 'Connect with any third-party service from payment processors to CRMs.' },
                { icon: ShoppingCart, label: 'Square POS', desc: 'Complete point-of-sale integration for e-commerce and in-person transactions.' },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="rounded-xl border border-aluminum/20 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="inline-flex rounded-lg bg-aluminum/10 p-2">
                    <feature.icon className="h-5 w-5 text-aluminum" />
                  </div>
                  <h3 className="mt-3 font-bold text-zero">{feature.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zero/50">{feature.desc}</p>
                </div>
              ))}
            </div>
            <div className="lg:order-2">
              <div className="inline-flex rounded-xl bg-aluminum/10 p-3">
                <Code2 className="h-7 w-7 text-aluminum" />
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                Enterprise Development
              </h2>
              <p className="mt-2 text-lg font-medium text-aluminum">Scalable technology for ambitious businesses.</p>
              <p className="mt-4 text-lg leading-relaxed text-zero/60">
                We build robust, performant applications using the latest technologies. From <span className="font-semibold text-fahrenheit">custom web apps to full-stack platforms</span>  with real-time capabilities, API integrations, and sophisticated data management.
              </p>
              <Button asChild className="mt-8 bg-aluminum hover:bg-aluminum/90 text-white gap-2">
                <Link href="/booking">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CMS Platforms */}
      {/* <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
              Flexible CMS Solutions
            </h2>
            <p className="mt-4 text-lg text-zero/60 max-w-2xl mx-auto">
              We work with the industry's leading content management systems to give you the perfect platform for your needs.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'WordPress', desc: 'The world\'s most popular CMS, perfect for blogs, corporate sites, and e-commerce.' },
              { name: 'HubSpot CMS', desc: 'Marketing-focused CMS with built-in CRM integration and automation.' },
              { name: 'Shopify', desc: 'Industry-leading e-commerce platform for online stores of all sizes.' },
              { name: 'Custom Solutions', desc: 'Headless CMS and custom platforms built for unique requirements.' },
            ].map((cms) => (
              <div key={cms.name} className="rounded-xl border border-zero/10 bg-[#f8f8f8] p-6 text-center">
                <h3 className="text-lg font-bold text-zero">{cms.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zero/60">{cms.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */} 

      {/* Process Section */}
      <section className="bg-zero py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Process
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
              A proven approach that delivers results every time.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', title: 'Discovery', desc: 'We learn your business, goals, audience, and competitive landscape.' },
              { step: '02', title: 'Strategy', desc: 'We design a conversion-focused plan tailored to your specific objectives.' },
              { step: '03', title: 'Build', desc: 'We develop your solution using modern tech with meticulous attention to detail.' },
              { step: '04', title: 'Launch & Scale', desc: 'We deploy, monitor, and optimize to ensure continuous growth.' },
            ].map((item) => (
              <div key={item.step} className="relative rounded-xl border border-white/10 bg-white/5 p-6">
                <span className="text-4xl font-bold text-fahrenheit/60">{item.step}</span>
                <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility Commitment */}
      {/* <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-zero/10 bg-[#f8f8f8] p-12 text-center">
            <div className="inline-flex rounded-full bg-fahrenheit/10 p-4 mb-6">
              <Accessibility className="h-8 w-8 text-fahrenheit" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
              Accessibility Is Not Optional
            </h2>
            <p className="mt-4 text-lg text-zero/60 max-w-2xl mx-auto">
              We build WCAG 2.1 AA compliant websites that work for everyone. Accessibility isn't just good practice—it's good business, opening your site to millions of additional users and improving SEO.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {['Keyboard Navigation', 'Screen Reader Support', 'Color Contrast', 'Alt Text', 'Focus Management'].map((item) => (
                <Badge key={item} className="bg-white border-zero/20 text-zero">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-fahrenheit" />
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section> */} 

      {/* Jesse Bio Section */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border-2 border-zero/10 bg-white p-8 md:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <img
                  src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Jesse%202026.jpg"
                  alt="Jesse Shepeard, Owner/Operator"
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-fahrenheit/50 shadow-2xl"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-zero mb-2">
                  Jesse Shepeard
                </h3>
                <p className="text-fahrenheit font-semibold text-lg mb-4">
                  Owner/Operator
                </p>
                <p className="text-base text-zero/80 mb-6 leading-relaxed">
                  With years of experience in web development and digital strategy, Jesse leads every project with a passion for creating exceptional digital experiences. His commitment to client success and innovative solutions has earned Sites on Polaris a reputation for excellence.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <a
                    href="https://www.instagram.com/sitesonpolaris/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 border-2 border-zero/20 rounded-full hover:border-fahrenheit hover:bg-fahrenheit hover:text-white transition-all duration-300"
                  >
                    <span className="font-medium">Instagram</span>
                  </a>
                  <a
                    href="https://www.facebook.com/sitesonpolaris"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 border-2 border-zero/20 rounded-full hover:border-fahrenheit hover:bg-fahrenheit hover:text-white transition-all duration-300"
                  >
                    <span className="font-medium">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
            Ready to Build Something Amazing?
          </h2>
          <p className="mt-4 text-lg text-zero/60">
            Let's create a website that drives real results for your business. Schedule a free consultation to get started.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
              <Link href="/booking">
                Schedule Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zero/20 text-zero hover:bg-zero/5"
            >
              <Link href="/portfolio">View Our Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
