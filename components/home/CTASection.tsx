import Link from 'next/link';
import { ArrowRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-zero py-24">
      <div className="absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-fahrenheit/10 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-sol/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
       
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Build Your{' '}
          <span className="bg-gradient-to-r from-fahrenheit via-mars to-sol bg-clip-text text-transparent">
            Revenue Engine?
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
          Let&apos;s discuss your business goals and create a digital strategy that drives real
          growth. Schedule a free consultation today.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2 px-8 py-6 text-base"
          >
            <Link href="/booking">
              Schedule Strategy Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white gap-2 px-8 py-6 text-base"
          >
            <Link href="/services">Explore Solutions</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
