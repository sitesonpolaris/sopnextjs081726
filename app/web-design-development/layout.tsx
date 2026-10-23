import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Custom Web Design & Development in Charlotte, NC',
  description:
    'Custom website design and development for small businesses in Charlotte, Gastonia and Gaston County, NC. Fast, mobile-first, SEO-ready sites built to turn visitors into leads.',
  path: '/web-design-development',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
