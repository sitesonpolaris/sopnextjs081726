import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Start a Web Design Project',
  description:
    'Tell us about your project and get started on a custom website with Sites on Polaris in Gastonia and Charlotte, NC.',
  path: '/web-service-form',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
