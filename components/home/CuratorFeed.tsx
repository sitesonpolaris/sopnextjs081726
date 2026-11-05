'use client';

import { useEffect } from 'react';

const FEED_SCRIPT = 'https://cdn.curator.io/published/cd39c1db-3583-410e-ad6c-edce0fba30a5.js';

// Curator.io social feed. The script is added on mount rather than as a <script> tag
// in the markup, because React doesn't run script tags it renders, so the feed would
// stay empty when someone navigates back to the homepage from another page.
export function CuratorFeed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.charset = 'UTF-8';
    script.src = FEED_SCRIPT;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <section className="bg-[#f8f8f8] pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div id="curator-feed-default-feed-layout">
          <a href="https://curator.io" target="_blank" rel="noopener noreferrer" className="crt-logo crt-tag">
            Powered by Curator.io
          </a>
        </div>
      </div>
    </section>
  );
}
