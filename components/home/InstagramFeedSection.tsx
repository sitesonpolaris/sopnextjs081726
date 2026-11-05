'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Instagram } from 'lucide-react';

const FEED_CONTAINER_ID = 'curator-feed-default-feed-layout';
const FEED_SCRIPT_ID = 'curator-feed-script';
const FEED_SCRIPT_SRC = 'https://cdn.curator.io/published/cd39c1db-3583-410e-ad6c-edce0fba30a5.js';
const LOAD_TIMEOUT_MS = 10000;

export function InstagramFeedSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setStatus('loading');

    const observer = new MutationObserver(() => {
      if (container.childElementCount > 0) {
        setStatus('loaded');
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    const timeout = window.setTimeout(() => {
      if (container.childElementCount === 0) setStatus('failed');
    }, LOAD_TIMEOUT_MS);

    const existing = document.getElementById(FEED_SCRIPT_ID);
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = FEED_SCRIPT_ID;
    script.src = FEED_SCRIPT_SRC;
    script.async = true;
    script.charset = 'UTF-8';
    document.body.appendChild(script);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      script.remove();
      container.innerHTML = '';
    };
  }, []);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-fahrenheit">
              Instagram
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
              Follow Along on Instagram
            </h2>
          </div>
          <a
            href="https://www.instagram.com/sitesonpolaris/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 rounded-lg border border-zero/15 px-5 py-3 text-sm font-semibold text-zero transition-colors hover:border-fahrenheit hover:text-fahrenheit"
          >
            <Instagram className="h-4 w-4" />
            Follow @sitesonpolaris
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="relative mt-12 min-h-[200px]">
          <div ref={containerRef} id={FEED_CONTAINER_ID} />

          {status === 'loading' && (
            <div className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-zero/5" />
              ))}
            </div>
          )}

          {status === 'failed' && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zero/20 bg-[#f8f8f8] px-6 py-16 text-center">
              <Instagram className="h-10 w-10 text-fahrenheit" />
              <p className="mt-4 text-lg font-semibold text-zero">Our latest posts are on Instagram</p>
              <p className="mt-2 text-sm text-zero/60">
                We couldn&apos;t load the feed right now. Visit our profile to see our newest work.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
