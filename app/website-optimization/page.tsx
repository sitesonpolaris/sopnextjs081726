'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Zap,
  Bot,
  Workflow,
  BarChart3,
  Layout,
  TrendingUp,
  Target,
  Search,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  LineChart,
  Gauge,
  Eye,
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
  client_results?: string;
}

export default function WebsiteOptimizationPage() {
  const [caseStudies, setCaseStudies] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_visible', true)
        .not('client_results', 'is', null)
        .order('sort_order', { ascending: true })
        .limit(6);

      if (data) {
        setCaseStudies(data);
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
            <Badge className="bg-sol/20 text-sol border-sol/30 mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              Website Optimization
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Continuous Improvement That Drives Growth
            </h1>
            <p className="mt-6 text-xl text-white/80 leading-relaxed">
              An AI-enabled blend of SEO, CRO, and smart automation that delivers predictable results month over month. Your website never stops improving, never stops growing.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
                <Link href="/booking">
                  Start Optimizing
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/portfolio">See Case Studies</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies with Results */}
      {caseStudies.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-wider text-fahrenheit">
                Proven Results
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                Website Optimization Case Studies
              </h2>
              <p className="mt-4 text-lg text-zero/60 max-w-2xl mx-auto">
                The proof is in the data. See how our research-driven, ongoing optimization approach has led to significant results for our clients.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.id}`}
                  className="group overflow-hidden rounded-2xl border border-zero/10 bg-[#f8f8f8] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zero/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge className="bg-fahrenheit text-white border-0">
                        <Award className="h-3 w-3 mr-1" />
                        Results
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-zero group-hover:text-fahrenheit transition-colors">
                      {project.title}
                    </h3>
                    {project.client_results && (
                      <p className="mt-2 text-2xl font-bold text-fahrenheit">
                        {project.client_results}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-zero/60">
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Optimization Section */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                Why Do You Need Web Optimization Services?
              </h2>
              <p className="mt-4 text-xl font-semibold text-fahrenheit">
                Because digital ink is never dry.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-zero/60">
                You invested a lot in building your company's website—time, money, and focus. Yet after all that, your site just isn't producing results. Conversions are low, engagement mediocre, leads have dried up and traffic has slowed.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-zero/60">
                You need a process of constant improvement not only to keep pace, but to win that long-term climb to the top. Without ongoing optimization, websites decline in performance over time as competitors improve and algorithms change.
              </p>
            </div>
            <div className="rounded-xl border border-zero/10 bg-white p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-fahrenheit/10 p-3">
                    <TrendingUp className="h-6 w-6 text-fahrenheit" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zero">With Optimization</h3>
                    <p className="mt-1 text-sm text-zero/60">Steady growth in traffic, rankings, and conversions month after month.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-aluminum/10 p-3">
                    <LineChart className="h-6 w-6 text-aluminum" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zero">Without Optimization</h3>
                    <p className="mt-1 text-sm text-zero/60">Performance peaks at launch, then gradually declines as competitors advance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Landscape Evolution */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
              The Digital Landscape is Constantly Evolving
            </h2>
            <p className="mt-4 text-xl text-fahrenheit font-semibold">
              Is your website doing the same?
            </p>
            <p className="mt-4 text-lg text-zero/60 max-w-2xl mx-auto">
              Converting your website into a powerhouse that performs requires a long-term commitment to your site's evolution coupled with proven expertise.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex rounded-full bg-fahrenheit/10 p-4 mb-4">
                <Search className="h-8 w-8 text-fahrenheit" />
              </div>
              <h3 className="text-lg font-bold text-zero">SEO Excellence</h3>
              <p className="mt-2 text-sm text-zero/60">Consistent improvements in organic search rankings and visibility.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex rounded-full bg-fahrenheit/10 p-4 mb-4">
                <Target className="h-8 w-8 text-fahrenheit" />
              </div>
              <h3 className="text-lg font-bold text-zero">CRO Mastery</h3>
              <p className="mt-2 text-sm text-zero/60">Dramatically improved conversion rates that align with your goals.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex rounded-full bg-fahrenheit/10 p-4 mb-4">
                <Users className="h-8 w-8 text-fahrenheit" />
              </div>
              <h3 className="text-lg font-bold text-zero">Better UX</h3>
              <p className="mt-2 text-sm text-zero/60">A flood of qualified traffic from organic search and improved user experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Impact Section */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-3 lg:items-center">
            {/* Image - 1/3 */}
            <div className="lg:col-span-1">
              <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/AI%201.jpeg"
                  alt="AI Impact on Web Search"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content - 2/3 */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <Badge className="bg-sol/20 text-sol border-sol/30 mb-4">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Ready Optimization
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                  AI is Impacting the Way Users Search
                </h2>
                <p className="mt-4 text-lg text-zero/60">
                  Don't let your website get left behind. In the era of AI, a high-performing site persuades humans while teaching and signaling trust to AI.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    title: 'AI-Powered',
                    desc: 'Research and strategy on your brand, competitors, and industry using AI-driven insights.',
                  },
                  {
                    title: 'AI-Ready',
                    desc: 'Websites built to be discovered by AI, complete with structured data and semantic markup.',
                  },
                  {
                    title: 'AI-Affecting',
                    desc: 'Optimizing your site content and design by identifying and creating high-impact improvements.',
                  },
                  {
                    title: 'AI-Clarity',
                    desc: 'Insights into your site performance across search and AI platforms like ChatGPT.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative rounded-xl border border-zero/10 bg-white p-6">
                    <div className="text-4xl font-bold text-sol/20 mb-3">0{idx + 1}</div>
                    <h3 className="text-lg font-bold text-zero mb-2">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-zero/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Make Website Work Harder */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="rounded-xl border border-zero/10 bg-[#f8f8f8] p-8">
              <div className="space-y-6">
                {[
                  { icon: Eye, title: 'Tap Into Potential', desc: 'We start by identifying opportunities to drive traffic and leads.' },
                  { icon: BarChart3, title: 'Monitor & Analyze', desc: 'We review analytics, deploy tools, monitor rankings and watch conversions multiply.' },
                  { icon: Target, title: 'Test & Optimize', desc: 'We perform tests, analyze results, rewrite content and craft persuasive CTAs.' },
                  { icon: TrendingUp, title: 'Repeat & Scale', desc: 'We measure, analyze and optimize again. And again. Because optimization never ends.' },
                ].map((step) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-lg bg-fahrenheit/10 p-2">
                      <step.icon className="h-5 w-5 text-fahrenheit" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zero">{step.title}</h3>
                      <p className="mt-1 text-sm text-zero/60">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                Make Your Website Work Harder
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zero/60">
                If your website isn’t generating leads and sales, it’s costing you money.
Your site should be <span className="font-semibold text-fahrenheit">your best salesperson</span> — working 24/7 to attract visitors, build trust, and turn traffic into revenue.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-zero/60">
                Building a website is just the start. Real growth comes from strategic optimization that transforms your site into a high-performing sales engine.
              </p>
              <Button asChild className="mt-8 bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
                <Link href="/booking">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Services */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-7xl px-6"> 
          <div className="grid gap-12 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                  Search Engine Optimization Services
                </h2>
                <p className="mt-4 text-lg text-zero/60">
                  Search is the most powerful source of traffic to your website. When it comes to SEO, <span className="font-semibold text-fahrenheit">one size does not fit all.</span>
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { icon: Search, title: 'Technical SEO', desc: 'Site speed, mobile optimization, structured data, and crawlability improvements.' },
                  { icon: Layout, title: 'On-Page SEO', desc: 'Content optimization, meta tags, headers, and internal linking strategies.' },
                  { icon: LineChart, title: 'Keyword Research', desc: 'Data-driven keyword analysis to target high-value search terms.' },
                  { icon: Users, title: 'Content Strategy', desc: 'Strategic content planning that ranks and converts visitors into customers.' },
                  { icon: BarChart3, title: 'Analytics & Reporting', desc: 'Comprehensive tracking and insights to measure what matters.' },
                  { icon: Award, title: 'Local SEO', desc: 'Dominate local search results and Google Maps for your service area.' },
                ].map((service) => (
                  <div key={service.title} className="rounded-xl border border-zero/10 bg-white p-6 hover:shadow-md transition-all">
                    <div className="inline-flex rounded-lg bg-fahrenheit/10 p-3">
                      <service.icon className="h-6 w-6 text-fahrenheit" />
                    </div>
                    <h3 className="mt-4 font-bold text-zero">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zero/60">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/SEO%20image.jpeg"
                  alt="SEO Services"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRO Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex rounded-xl bg-fahrenheit/10 p-3">
                <Target className="h-7 w-7 text-fahrenheit" />
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                Conversion Rate Optimization
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zero/60">
                Search drives visitors, but traffic is almost never the goal. Every abandoned shopping cart, every unclicked link in your funnel, <span className="font-semibold text-fahrenheit">every form that goes unfilled is a lost opportunity.</span>
              </p>
              <p className="mt-4 text-lg leading-relaxed text-zero/60">
                Our CRO services apply revenue-maximizing science to your messaging, layout, and designs. Website optimization is not just about getting traffic—your success comes from getting visitors to convert into leads, customers, subscribers, and donors.
              </p>
              <Button asChild className="mt-8 bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
                <Link href="/booking">
                  Start Optimizing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'A/B Testing', desc: 'Data-driven experiments to identify what converts best.' },
                { label: 'User Behavior Analysis', desc: 'Heatmaps and session recordings reveal optimization opportunities.' },
                { label: 'Funnel Optimization', desc: 'Remove friction and guide visitors to conversion.' },
                { label: 'Persuasive Copywriting', desc: 'Message optimization that speaks to your audience\'s needs.' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-zero/10 bg-[#f8f8f8] p-5"
                >
                  <div className="inline-flex rounded-lg bg-fahrenheit/10 p-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-fahrenheit" />
                  </div>
                  <h3 className="font-bold text-zero">{item.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zero/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Systems + Automation */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Workflow, label: 'n8n Workflows', desc: 'Visual workflow automation connecting your apps and services without code.' },
                { icon: Bot, label: 'AI Integration', desc: 'Smart chatbots, content generation, and predictive analytics powered by AI.' },
                { icon: BarChart3, label: 'CRM Automation', desc: 'Automated lead nurturing, follow-ups, and pipeline management.' },
                { icon: Layout, label: 'Custom Dashboards', desc: 'Real-time business intelligence dashboards tailored to your KPIs.' },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="rounded-xl border border-sol/20 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="inline-flex rounded-lg bg-sol/10 p-2">
                    <feature.icon className="h-5 w-5 text-sol" />
                  </div>
                  <h3 className="mt-3 font-bold text-zero">{feature.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zero/50">{feature.desc}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="inline-flex rounded-xl bg-sol/10 p-3">
                <Zap className="h-7 w-7 text-sol" />
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
                Systems + Automation
              </h2>
              <p className="mt-2 text-lg font-medium text-sol">Remove bottlenecks. Scale without limits.</p>
              <p className="mt-4 text-lg leading-relaxed text-zero/60">
                We design and implement intelligent automation that eliminates manual processes, reduces errors, and frees your team to focus on what matters. Your business runs smoother, even while you sleep.
              </p>
              <Button asChild className="mt-8 bg-sol hover:bg-sol/90 text-white gap-2">
                <Link href="/booking">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
              What to Expect from Website Optimization
            </h2>
            <p className="mt-4 text-lg text-zero/60 max-w-2xl mx-auto">
              Website optimization has a powerful and durable impact that lasts for years.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: TrendingUp, title: 'Steady Growth', desc: 'Predictable long-term results month-over-month.' },
              { icon: Search, title: 'Higher Rankings', desc: 'Improved visibility in search engines and AI platforms.' },
              { icon: Target, title: 'More Conversions', desc: 'Better conversion rates from your existing traffic.' },
              { icon: Users, title: 'Increased Traffic', desc: 'More qualified visitors finding your business online.' },
              { icon: Gauge, title: 'Better Performance', desc: 'Faster load times and improved user experience.' },
              { icon: Award, title: 'Competitive Edge', desc: 'Stay ahead of competitors who let their sites stagnate.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-zero/10 bg-[#f8f8f8] p-6">
                <div className="inline-flex rounded-full bg-fahrenheit/10 p-3">
                  <item.icon className="h-6 w-6 text-fahrenheit" />
                </div>
                <h3 className="mt-4 font-bold text-zero">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zero/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-zero py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Optimization Process
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

    

      {/* Final CTA */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zero sm:text-4xl">
            Ready to Start Optimizing?
          </h2>
          <p className="mt-4 text-lg text-zero/60">
            Let's unlock your website's full potential and drive predictable growth for your business.
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
              <Link href="/portfolio">View Case Studies</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
