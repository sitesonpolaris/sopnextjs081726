import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogList } from '@/components/blog/BlogList';
import { getPublishedPosts } from '@/lib/blog';
import { pageMetadata } from '@/lib/seo';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Web Design Blog: Charlotte & Gastonia, NC Insights',
  description:
    'Web design, SEO and digital marketing advice for small businesses in Charlotte, Gastonia and Gaston County, NC, from the team at Sites on Polaris.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <section className="bg-white pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Blog</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-zero">Web Design Blog:</span>
              <br />
              <span className="text-fahrenheit">Charlotte NC Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-zero/80 max-w-3xl mx-auto leading-relaxed">
              Expert insights on web design, SEO strategies, and digital marketing for Charlotte businesses.
              Learn from real case studies and industry best practices.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f8f8] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <BlogList posts={posts} />
        </div>
      </section>

      <section className="bg-zero py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Want Us to Build Your Revenue Engine?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Schedule a free strategy consultation to discuss your business goals.
          </p>
          <Button asChild className="mt-8 bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
            <Link href="/booking">
              Schedule Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
