import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Script from 'next/script';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sitesonpolaris.com'),
  title: 'Custom Web Design in Charlotte, NC | High-Converting Business Websites',
  description: 'Custom-designed websites built to convert visitors into leads. React development & Wix Partner, SEO-ready, mobile-optimized, and scalable. Serving Charlotte & Gastonia.',
  keywords: 'Charlotte web design, Gastonia web designer, Custom website design, Wix web designer, Small business web design, Professional web design agency',
  authors: [{ name: 'Sites on Polaris - Jesse Shepeard' }],
  robots: 'index, follow',
  icons: {
    icon: 'https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/SOP_Logo_Brandmark_RGB_SOP_Logo_Brandmark_Red_RGB.png',
  },
  openGraph: {
    title: 'Custom Web Design in Charlotte, NC | High-Converting Business Websites',
    description: 'Custom-designed websites built to convert visitors into leads. React development & Wix Partner, SEO-ready, mobile-optimized, and scalable. Serving Charlotte & Gastonia.',
    type: 'website',
    url: 'https://sitesonpolaris.com',
    siteName: 'Sites on Polaris',
    images: [
      {
        url: 'https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/youtube%20banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Sites on Polaris - Custom Web Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Web Design in Charlotte, NC | High-Converting Business Websites',
    description: 'Custom-designed websites built to convert visitors into leads. React development & Wix Partner, SEO-ready, mobile-optimized, and scalable. Serving Charlotte & Gastonia.',
    images: ['https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/youtube%20banner.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KLLZ8JDZ');`}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K5S9WQNZXS"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-K5S9WQNZXS');
          `}
        </Script>

        <Script id="clarity-script" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "vbdmo2vygq");`}
        </Script>

        <Script id="schema-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Sites on Polaris",
            "description": "Custom-designed websites built to convert visitors into leads. React development & Wix Partner, SEO-ready, mobile-optimized, and scalable. Serving Charlotte & Gastonia.",
            "url": "https://sitesonpolaris.com",
            "telephone": "(704) 251-5030",
            "email": "hello@sitesonpolaris.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Charlotte",
              "addressRegion": "NC",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "35.2271",
              "longitude": "-80.8431"
            },
            "areaServed": {
              "@type": "State",
              "name": "North Carolina"
            },
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "35.2271",
                "longitude": "-80.8431"
              },
              "geoRadius": "100"
            },
            "priceRange": "$499-$5000",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "25",
              "bestRating": "5",
              "worstRating": "5"
            },
            "founder": {
              "@type": "Person",
              "name": "Jesse Shepeard"
            },
            "sameAs": [
              "https://www.facebook.com/sitesonpolaris",
              "https://www.instagram.com/sitesonpolaris/",
              "https://g.page/r/CcI5OOZ1D5p1EB0"
            ]
          })}
        </Script>
      </head>
      <body className={`${spaceGrotesk.variable} font-sans`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KLLZ8JDZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
