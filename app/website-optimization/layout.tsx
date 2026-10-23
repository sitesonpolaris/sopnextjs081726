import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Website Optimization, SEO & CRO in Charlotte, NC',
  description:
    'Ongoing SEO, conversion rate optimization and AI-enabled automation for business websites in Charlotte and Gastonia, NC. Your site keeps improving month over month.',
  path: '/website-optimization',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
