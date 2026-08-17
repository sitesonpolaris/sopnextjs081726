'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export function HeroSection() {
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/animations/hero-animation.json')
      .then(res => res.json())
      .then(data => {
        setAnimationData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load animation:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col h-[120vh] md:h-[100vh]">
        {/* Lottie Animation Container - Always rendered to prevent layout shift */}
        <div className="w-full max-w-3xl mt-24 md:mt-2 mb-8 min-h-[300px] md:min-h-[400px]">
          {isLoading ? (
            <Skeleton className="w-full h-[300px] md:h-[400px] rounded-lg" />
          ) : animationData ? (
            <div className="animate-fade-in">
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
              />
            </div>
          ) : (
            <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg" />
          )}
        </div>

        {/* Headline */}
        <h1 className="text-xl sm:text-3xl md:text-3xl lg:text-3xl font-bold text-neutral-dark mb-2 leading-tight" style={{ animationDelay: '0.1s' }}>
          We don&apos;t just build websites.{' '}
          <br></br>
          <span className="relative">
            <span className="bg-gradient-to-r from-fahrenheit via-mars to-sol bg-clip-text text-transparent">
              We build revenue engines.
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-bold text-neutral-dark mb-3 sm:mb-4" style={{ animationDelay: '0.2s' }}>
          Custom Web Design for Growing Businesses in Charlotte & Gastonia
        </p>

        <p className="text-neutral-dark/70 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8" style={{ animationDelay: '0.25s' }}>
          Your website should be a lead-generating asset, not just an online brochure. We create high-converting websites that turn visitors into customers.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button
            asChild
            size="lg"
            className="bg-accent-red text-white px-6 py-3 text-sm font-semibold tracking-wide hover:bg-neutral-dark transition-all duration-300 inline-flex items-center justify-center min-h-[44px]"
          >
            <Link href="/booking">
              👉 Get a Free Website Audit
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-neutral-dark text-white px-6 py-3 text-sm font-semibold tracking-wide hover:bg-neutral-dark/80 transition-all duration-300 inline-flex items-center justify-center min-h-[44px]"
          >
            <Link href="/portfolio">
              See How It Works
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

       
      </div>
    </section>
  );
}
