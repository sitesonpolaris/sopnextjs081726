import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Meteor House Marketing Partner',
  description:
    'Sites on Polaris partners with Meteor House for branding, video and social content, paired with custom web design for businesses in Charlotte and Gastonia, NC.',
  path: '/meteor-house',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
