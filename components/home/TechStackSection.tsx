'use client';

const techStack = [
  {
    name: "React - Programming",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    website: "https://react.dev"
  },
  {
    name: "TypeScript - Programming",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    website: "https://www.typescriptlang.org"
  },
  {
    name: "Tailwind CSS - Code Design",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    website: "https://tailwindcss.com"
  },
  {
    name: "Supabase - Database",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
    website: "https://supabase.com"
  },
  {
    name: "OpenAI - AI",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHhWFQjlehvFtILJmgJCVLomliQjbJiDwXcA&s",
    website: "https://openai.com/index/openai-api/"
  },
  {
    name: "Stripe - Payment Processing",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQGluJhW7I1NYU7jF77E-9K9I46_ib_DUNHw&s",
    website: "https://stripe.com/"
  },
  {
    name: "n8n - Automation",
    logo: "https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/n8n%20logo.png",
    website: "https://n8n.io/"
  },
  {
    name: "Wix - Partner Program",
    logo: "https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Wix%20logo.png",
    website: "https://www.wix.com/studio/community/partners/jesse-shepeard"
  }
];

export function TechStackSection() {
  return (
    <section className="overflow-hidden bg-zero py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-aluminum">
          Our Technology
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Built with Industry-Leading Technology
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
          We use the most modern and reliable tools to build fast, scalable, and secure applications.
        </p>
      </div>

      <div className="mt-16 relative">
        <div className="absolute left-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-r from-zero to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-l from-zero to-transparent" />

        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-8">
            {[...techStack, ...techStack].map((tech, idx) => (
              <a
                key={`${tech.name}-${idx}`}
                href={tech.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <img
                  src={tech.logo}
                  alt={`${tech.name} logo`}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-sm font-semibold text-white/80 whitespace-nowrap">{tech.name}</span>
              </a>
            ))}
          </div>
          <div className="animate-marquee flex shrink-0 items-center gap-8" aria-hidden="true">
            {[...techStack, ...techStack].map((tech, idx) => (
              <a
                key={`dup-${tech.name}-${idx}`}
                href={tech.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <img
                  src={tech.logo}
                  alt={`${tech.name} logo`}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-sm font-semibold text-white/80 whitespace-nowrap">{tech.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
