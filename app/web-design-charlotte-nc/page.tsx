import { ServiceAreaPage } from '@/components/service-area/ServiceAreaPage';
import { getServiceArea } from '@/lib/service-areas';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

const area = getServiceArea('web-design-charlotte-nc');

export const metadata = pageMetadata({
  title: area.metaTitle,
  description: area.metaDescription,
  path: `/${area.slug}`,
});

export default function Page() {
  return <ServiceAreaPage area={area} />;
}
