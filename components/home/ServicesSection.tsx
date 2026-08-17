import Link from 'next/link';
import { Paintbrush, Code2, Zap, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Paintbrush,
    title: 'High-Conversion Design',
    description:
      'Beautiful, strategic design that turns visitors into customers. Every pixel is placed with purpose to maximize engagement and drive measurable results.',
    features: ['UX/UI Strategy', 'Responsive Design', 'Landing Pages', 'Brand Integration'],
    color: 'fahrenheit',
    href: '/services#design',
  },
  {
    icon: Code2,
    title: 'Enterprise Development',
    description:
      'Scalable, performant applications built with modern technology. From React frontends to full-stack platforms with real-time data and API integrations.',
    features: ['React / Next.js', 'Supabase Backend', 'API Integrations', 'Square POS'],
    color: 'aluminum',
    href: '/services#development',
  },
  {
    icon: Zap,
    title: 'Systems + Automation',
    description:
      'Remove operational bottlenecks with intelligent automation. We connect your tools, automate workflows, and build systems that run without you.',
    features: ['n8n Workflows', 'AI Integration', 'CRM Automation', 'Custom Dashboards'],
    color: 'sol',
    href: '/services#automation',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  fahrenheit: {
    bg: 'bg-fahrenheit/5',
    border: 'border-fahrenheit/20',
    text: 'text-fahrenheit',
    iconBg: 'bg-fahrenheit/10',
  },
  aluminum: {
    bg: 'bg-aluminum/5',
    border: 'border-aluminum/20',
    text: 'text-aluminum',
    iconBg: 'bg-aluminum/10',
  },
  sol: {
    bg: 'bg-sol/5',
    border: 'border-sol/20',
    text: 'text-sol',
    iconBg: 'bg-sol/10',
  },
};

export function ServicesSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-fahrenheit">
            What We Do
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zero sm:text-4xl lg:text-5xl">
            Three Pillars of Digital Growth
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zero/60">
            We combine design, development, and automation to build complete digital ecosystems that
            generate revenue on autopilot.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {services.map((service) => {
            const colors = colorMap[service.color];
            return (
              <Link
                key={service.title}
                href={service.href}
                className={`group relative rounded-2xl border ${colors.border} ${colors.bg} p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className={`inline-flex rounded-xl ${colors.iconBg} p-3`}>
                  <service.icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-zero">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zero/60">{service.description}</p>
                <ul className="mt-5 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-zero/70">
                      <div className={`h-1.5 w-1.5 rounded-full ${colors.text} opacity-60`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className={`mt-6 inline-flex items-center gap-1 text-sm font-semibold ${colors.text} transition-all group-hover:gap-2`}>
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
