import Image from 'next/image';
import { Star } from 'lucide-react';
import { MockupRequestForm } from '@/components/free-mockup/MockupRequestForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Get a Free Homepage Mockup',
  description:
    'Tell me about your business and I’ll design a free mockup of your new homepage. Custom websites for Gastonia and Charlotte small businesses, starting at $500.',
  path: '/free-mockup',
});

const JESSE_PHOTO =
  'https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Jesse%202026.jpg';

const steps = [
  { title: 'Tell me about your business', desc: 'Takes about two minutes.' },
  { title: 'I design your homepage', desc: 'A mockup of your new homepage, built around your business.' },
  { title: 'You decide', desc: "Like it? We build it, from $500. If not, no hard feelings." },
];

export default function FreeMockupPage() {
  return (
    <section className="bg-[#f8f8f8] pb-20 pt-28 lg:pt-36">
      {/* Phones: intro, then the form, then the supporting detail. Desktop: form on the right. */}
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 xl:grid-cols-12 xl:grid-rows-[auto_1fr] xl:gap-x-16 xl:gap-y-8">
        <div className="flex flex-col gap-5 xl:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-fahrenheit sm:text-sm">
            Free homepage mockup
          </p>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-zero sm:text-5xl">
            See your new homepage before you commit.
          </h1>
          <p className="text-base leading-relaxed text-zero/80 sm:text-lg">
            Fill this out and I&apos;ll design a mockup of your new homepage, free. You&apos;ll see
            exactly what you&apos;re getting before you spend anything.
          </p>
        </div>

        <div className="relative rounded-2xl border border-zero/10 bg-white p-5 shadow-sm sm:p-8 xl:col-span-7 xl:col-start-6 xl:row-span-2 xl:row-start-1 xl:self-start">
          <MockupRequestForm />
        </div>

        <div className="flex flex-col gap-6 xl:col-span-5">
          <ol className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <li key={step.title} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fahrenheit text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-zero">{step.title}</p>
                  <p className="text-[15px] leading-snug text-zero/80">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex items-center gap-3.5 rounded-2xl bg-zero p-4 text-white sm:max-w-md">
            <Image
              src={JESSE_PHOTO}
              alt="Jesse Shepeard"
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1">
              <p className="text-[15px] leading-snug">
                You&apos;ll work directly with <strong>Jesse</strong>, start to finish. No salespeople.
              </p>
              <div className="flex items-center gap-1.5 text-[13px] text-white/80">
                <span className="flex gap-0.5" role="img" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-sol text-sol" aria-hidden="true" />
                  ))}
                </span>
                <span>5.0 · 25+ Google reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
