import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone, Star } from 'lucide-react';

const JESSE_PHOTO =
  'https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Jesse%202026.jpg';

const steps = [
  {
    title: 'Free homepage mockup',
    desc: "Tell me about your business. I'll design your homepage so you can see it first.",
  },
  {
    title: 'Built in 2–6 weeks',
    desc: 'Fast, mobile-friendly and set up for Google from day one.',
  },
  {
    title: 'Launch and grow',
    desc: 'Go live with a site built to bring in calls, bookings and sales.',
  },
];

function Stars({ className }: { className: string }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${className} fill-sol text-sol`} aria-hidden="true" />
      ))}
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-8 pt-28 sm:px-6 xl:grid-cols-12 lg:pb-16 lg:pt-36">
        <div className="flex flex-col gap-5 lg:gap-6 xl:col-span-7">
          {/* The H1 carries the search keywords; the big line below is the visual headline. */}
          <h1 className="text-xs font-semibold uppercase tracking-wider text-fahrenheit sm:text-sm">
            Web design for Gastonia &amp; Charlotte small businesses
          </h1>
          <p className="text-[2.5rem] font-bold leading-[1.04] tracking-tight text-zero sm:text-6xl lg:text-7xl">
            See your new homepage before you commit.
          </p>
          <p className="max-w-xl text-base leading-relaxed text-zero/80 sm:text-xl">
            Tell me about your business and I&apos;ll design a mockup of your new homepage, free.
            Like it? We build it. Custom websites start at $500.
          </p>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/booking"
              className="inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-fahrenheit px-7 text-base font-bold text-white transition-colors hover:bg-fahrenheit/90 sm:h-[60px] sm:text-lg"
            >
              Get My Free Homepage Mockup
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <a
              href="tel:+17042515030"
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap text-[15px] font-medium text-zero transition-colors hover:text-fahrenheit sm:text-base"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              or call (704) 251-5030
            </a>
          </div>
          <p className="hidden text-[15px] text-zero/80 sm:block">
            No cost, no obligation. We don&apos;t just build websites. We build revenue engines.
          </p>

          {/* Below 1280px: compact Jesse card in place of the large photo. */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-zero p-3.5 text-white sm:max-w-md xl:hidden">
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
                <Stars className="h-3.5 w-3.5" />
                <span>5.0 · 25+ Google reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Jesse's photo with the review badge and intro card. */}
        <figure className="relative hidden h-[520px] xl:col-span-5 xl:block">
          <Image
            src={JESSE_PHOTO}
            alt="Jesse Shepeard, founder of Sites on Polaris"
            width={420}
            height={470}
            priority
            sizes="420px"
            className="absolute right-0 top-0 h-[470px] w-[420px] rounded-[20px] object-cover"
          />
          <div className="absolute left-6 top-7 flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-3.5 py-2.5 text-sm text-zero shadow-[0_10px_30px_rgba(46,51,66,0.16)]">
            <Stars className="h-4 w-4" />
            <span>
              <strong>5.0</strong> · 25+ Google reviews
            </span>
          </div>
          <figcaption className="absolute bottom-0 left-0 w-80 rounded-2xl bg-zero px-[22px] py-5 text-white shadow-[0_18px_40px_rgba(46,51,66,0.28)]">
            <p className="mb-1.5 text-lg font-bold">Hi, I&apos;m Jesse.</p>
            <p className="text-[15px] leading-normal text-white/85">
              You&apos;ll work directly with me, from the first call to launch day. No salespeople.
            </p>
          </figcaption>
        </figure>
      </div>

      <div className="border-t border-zero/10 lg:bg-[#f8f8f8]">
        <ol className="mx-auto grid max-w-7xl gap-2.5 px-5 pb-10 pt-6 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:py-7">
          {steps.map((step, i) => (
            <li key={step.title} className="flex items-center gap-3 lg:items-start lg:gap-4">
              <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-fahrenheit text-[13px] font-bold text-white lg:h-9 lg:w-9 lg:text-base">
                {i + 1}
              </span>
              <div>
                <p className="text-[15px] text-zero lg:text-[17px] lg:font-bold">{step.title}</p>
                <p className="mt-1 hidden text-[15px] leading-snug text-zero/80 lg:block">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
