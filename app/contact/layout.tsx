import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with Sites on Polaris, a web design studio serving Gastonia, Charlotte and Gaston County, NC. Call (704) 251-5030 or send us a message.',
  path: '/contact',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
