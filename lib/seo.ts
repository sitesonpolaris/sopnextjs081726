import type { Metadata } from 'next';

export const SITE_URL = 'https://sitesonpolaris.com';
export const SITE_NAME = 'Sites on Polaris';
export const LOGO_URL =
  'https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/SOP_Logo_Full_RGB_SOP_Logo_Full_RGB_Red.png';
export const DEFAULT_OG_IMAGE =
  'https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/youtube%20banner.jpg';
export const SOCIAL_LINKS = [
  'https://www.facebook.com/sitesonpolaris',
  'https://www.instagram.com/sitesonpolaris/',
  'https://g.page/r/CcI5OOZ1D5p1EB0',
];

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

// Builds per-page metadata. `title` goes through the root "%s | Sites on Polaris"
// template; Open Graph/Twitter titles don't, so the suffix is added there by hand.
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

// Serializes JSON-LD for a <script> tag, escaping "<" so content can't close the tag.
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
