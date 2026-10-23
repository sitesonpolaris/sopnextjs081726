export interface ServiceArea {
  slug: string;
  city: string;
  // Matches the place tags used on blog posts, e.g. "Gastonia NC".
  blogTag: string;
  metaTitle: string;
  metaDescription: string;
  heroIntro: string;
  localHeading: string;
  localParagraphs: string[];
  faqs: { question: string; answer: string }[];
}

const sharedFaqs = (city: string) => [
  {
    question: `How much does a website cost in ${city}?`,
    answer:
      'Most small business websites in the Gastonia and Charlotte area cost anywhere from a few hundred dollars (DIY builders or gig freelancers) to around $5,500 with an independent designer, and local agencies typically start around $4,000. Where you land depends on how many pages you need and what the site has to do. We give you a straight quote after a free consultation.',
  },
  {
    question: 'How long does it take to build a small business website?',
    answer:
      'A focused small business site typically takes 2 to 6 weeks, depending on the number of pages, the features involved and how quickly content comes together. Simple one-page sites can be faster.',
  },
  {
    question: 'Will I be working with a salesperson?',
    answer:
      "No. You'll talk directly with Jesse, the person who designs and builds your site, from the first call through launch.",
  },
  {
    question: `Do you only work with businesses in ${city}?`,
    answer:
      'No. We build websites for businesses and nonprofits across Gastonia, Charlotte and Gaston County, and for clients beyond the Charlotte region.',
  },
];

export const SERVICE_AREAS: ServiceArea[] = [
  {
    slug: 'web-design-gastonia-nc',
    city: 'Gastonia',
    blogTag: 'Gastonia NC',
    metaTitle: 'Web Design in Gastonia, NC',
    metaDescription:
      'Custom websites for Gastonia and Gaston County small businesses. Fast, mobile-friendly sites built to bring in calls, bookings and sales, with straight quotes and no salespeople.',
    heroIntro:
      "Most Gastonia businesses don't need an agency-sized website. They need a fast, clear site that shows up when someone nearby searches, explains what you do in a few seconds, and makes it easy to call, book or buy. That's what we build for small businesses across Gastonia and Gaston County.",
    localHeading: 'Why Local Web Design Matters in Gaston County',
    localParagraphs: [
      "Gastonia customers search the way everyone does now: on a phone, often with \"near me\" or a town name attached. Your site needs to load quickly on a phone, name the places you serve, and match the details on your Google Business Profile, so Google is confident about where you are and what you do.",
      'Gastonia is the county seat of Gaston County, about 20 miles west of uptown Charlotte along I-85, and plenty of local businesses sell into both markets. We build sites that speak to both audiences without stuffing them with keywords: clear service pages, real photos of your work, and a simple path to get in touch.',
      'We work with the kinds of businesses that keep Gaston County running: food trucks, barbershops, cleaning companies, nonprofits, coaches and boutiques. Each one needs something different from its website, so we start with how your customers actually find and choose you.',
    ],
    faqs: sharedFaqs('Gastonia'),
  },
  {
    slug: 'web-design-charlotte-nc',
    city: 'Charlotte',
    blogTag: 'Charlotte NC',
    metaTitle: 'Web Design in Charlotte, NC',
    metaDescription:
      'Custom web design for Charlotte small businesses and nonprofits. Fast, SEO-ready websites built to stand out in a competitive market and turn visitors into calls, bookings and sales.',
    heroIntro:
      'Charlotte is a crowded market. Whatever you do, a dozen other businesses do it too, and most customers compare a few websites before they ever pick up the phone. We build custom websites that help Charlotte small businesses and nonprofits win that comparison.',
    localHeading: 'Standing Out in a Competitive Market',
    localParagraphs: [
      "In a city this size, a template site that looks like your competitor's makes it hard for anyone to remember you. A custom design built around your real photos, services and reviews gives people a reason to choose you, and a clear next step once they do.",
      'Search is just as competitive. We build in the foundations Google looks for from day one: fast pages, a clear title and description on every page, structured data, and service pages that say plainly what you do and where. If you want to keep climbing after launch, our ongoing optimization work picks up from there.',
      "We've built sites for Charlotte organizations ranging from a professional networking group to a community nonprofit serving youth, women and the elderly. You'll find that work below.",
    ],
    faqs: sharedFaqs('Charlotte'),
  },
];

export function getServiceArea(slug: string): ServiceArea {
  const area = SERVICE_AREAS.find((a) => a.slug === slug);
  if (!area) throw new Error(`Unknown service area: ${slug}`);
  return area;
}
