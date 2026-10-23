import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Book a Free Web Design Consultation',
  description:
    'Schedule a free strategy consultation or website audit with Sites on Polaris, serving businesses in Gastonia, Charlotte and Gaston County, NC.',
  path: '/booking',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
