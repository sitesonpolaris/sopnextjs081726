import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';

export const metadata = {
  title: 'Portfolio | Sites on Polaris - Charlotte, NC Web Design Projects',
  description:
    'Explore our portfolio of custom web design and development projects for businesses in Charlotte, NC and beyond.',
};

export default function PortfolioPage() {
  return (
    <>
      <section className="bg-white pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-fahrenheit">
            Our Work
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zero sm:text-5xl">
            Web Design Portfolio
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zero/60">
            Real results for real businesses. Browse our Charlotte, NC web design and development
            projects spanning nonprofits, e-commerce, education, and more.
          </p>
        </div>
      </section>

      <section className="bg-[#f8f8f8] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <PortfolioGrid />
        </div>
      </section>

      <section className="bg-zero py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Join Our Charlotte Success Stories?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Let&apos;s discuss your project and create something that drives real results for your
            business.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
              <Link href="/booking">
                Schedule Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
