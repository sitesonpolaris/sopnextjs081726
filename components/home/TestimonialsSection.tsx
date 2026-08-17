'use client';

import { useEffect, useState } from 'react';
import { Star, Quote, ArrowUpRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  text: string;
  rating: number;
  avatar: string;
}

const hardcodedTestimonials: Testimonial[] = [
  {
    id: 'additional-11',
    name: "AMO Charities",
    position: "Nonprofit Organization",
    text: "Outstanding experience working with Jesse as our website/web app developer. He created our new website with integrated web app features for our programs to capture metrics and participation — needed very little direction to bring our ideas to life. Jesse was able to capture our vision perfectly with clean, futuristic, and polished designs. Professional, patient, timely, and responsive throughout the process — we look forward to working with Jesse again on future projects.  10/10 would recommend!",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjVIVJMthrEs-txBW0f2H1hnk6tCMnb7sYAjzUslH6vhye40dIA=w36-h36-p-rp-mo-br100"
  },
  {
    id: 'additional-12',
    name: "Donte J",
    position: "J1S Bartending",
    text: "I have worked with Jesse at SoP for multiple website updates and redesign projects. Jesse always exceeds my expectations! Jesse is always available to assist with any questions I may have throughout the years. I highly recommend Sites on Polaris and will continue working with Jesse on upcoming business ventures.",
    rating: 5,
    avatar: "https://static.wixstatic.com/media/c73eb8_4de02b264d2d49998566ca41861dc230~mv2.jpg/v1/crop/x_0,y_2163,w_4672,h_3517/fill/w_531,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/DSC02600.jpg"
  },
  {
    id: 'additional-1',
    name: "Michael Holmes",
    position: "HMA Consulting",
    text: "Jesse is a phenom! He has helped my business to incredible growth in our first 13 months. Our site is performing great!",
    rating: 5,
    avatar: "https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Reviews/Michael%20Holmes.jpg"
  },
  {
    id: 'additional-2',
    name: "Vera Martin",
    position: "Encours Consulting",
    text: "Jesse is extremely creative, professional, knowledgeable, and flexible. He created my vision perfectly.",
    rating: 5,
    avatar: "https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Reviews/Vera%20Martin-new.jpg"
  },
  {
    id: 'additional-5',
    name: "A. Edwards",
    position: "Keeping the Towel",
    text: "Jesse listened to my vision, elevated my website far beyond my original design, and brought it to life with professionalism and constant communication.",
    rating: 5,
    avatar: "https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Reviews/A%20Edwards.jpg"
  },
  {
    id: 'additional-3',
    name: "Charles Robinson-Snead",
    position: "Colour My Mind",
    text: "SOP and Jesse brought my vision to life with patience, creativity, and expert knowledge—he's the real deal for anyone building a brand.",
    rating: 5,
    avatar: "https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Reviews/Charles%20Snead.jpg"
  },
  {
    id: 'additional-6',
    name: "Maurice McDonald",
    position: "LifeVantage Rep",
    text: "This was an amazing experience. The services was professional and I would highly recommend Sites on Polaris",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXWzx5WRGPe4WKvK7VPTg_U3gXAu16JeJ6QtoO8sm-6MV6DEEae=w36-h36-p-rp-mo-br100"
  },
  {
    id: 'additional-7',
    name: "Jonathon Shepeard",
    position: "The Payments Plug",
    text: "Hands down the most professional and best web developer to work with!",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXHyxz7MmuHBTCZbL-FLYtlDwoUvJLm6AwmNs3Bl3DN2RhGyPeY=w36-h36-p-rp-mo-br100"
  },
  {
    id: 'additional-4',
    name: "Toni Blake",
    position: "Toni Blake Projects",
    text: "Jesse was incredibly responsive and professional—he truly listened to my needs and delivered a final product that reflected my vision perfectly.",
    rating: 5,
    avatar: "https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Reviews/Toni.jpg"
  },
  {
    id: 'additional-8',
    name: "Ronnisha Green",
    position: "Journey Lynn's Boutique",
    text: "Jesse recently brought my vision to life with an amazing logo for my daughters boutique (Journey Lynne's Boutique). What I loved most was the dedication to ensuring I was completely happy with the end result. He took his time to perfect an idea that I had and he ultimately surpassed my expectations. He was very communicative throughout the process and for me, someone who is super indecisive I never felt like a bother anytime I had new ideas or wanted to make changes. Overall it was a great experience and I look forward to working with him again in the future!",
    rating: 5,
    avatar: "https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Reviews/journey%20lynne%20logo.jpg"
  },
  {
    id: 'additional-9',
    name: "Ezra Jackson",
    position: "Deuce",
    text: "Definitely one of the best web designers in Charlotte. Hetakes his time to develop what you vision.",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWjm9udboRc0y9h4sl5ypRcBzDA8xpHo6MnxrU2B7kNJcsgi-QoFQ=w36-h36-p-rp-mo-br100"
  },
  {
    id: 'additional-10',
    name: "Kertricia Taylor",
    position: "Baskets Extreme",
    text: "We trusted this business to bring our dream to life and we're so amazed with the final product!! We got the website that we dreamed of! Great work and good timing. I would definitely recommend them for anyone wanting to launch their website! Thank you so much!!",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWkGHzoBMJLX-yMnKqyae_1l4BKonsFHb-ElpXA3sQlTRwKCrs=w36-h36-p-rp-mo-br100"
  }
];

export function TestimonialsSection() {
  const [testimonials] = useState<Testimonial[]>(hardcodedTestimonials);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const current = testimonials[active];

  if (!current) return null;

  return (
    <section className="bg-[#f8f8f8] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-fahrenheit">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zero sm:text-4xl">
              What Our Clients Say
            </h2>

            <div className="mt-10 relative min-h-[280px]">
              <Quote className="absolute -left-2 -top-2 h-12 w-12 text-fahrenheit/10" />
              <blockquote className="relative pl-4">
                <p className="text-xl leading-relaxed text-zero/80 lg:text-md">
                  &ldquo;{current.text}&rdquo;
                </p>
                <footer className="mt-6">
                  <div className="flex items-center gap-2">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-sol text-sol" />
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-zero">{current.name}</p>
                      <p className="text-sm text-zero/50">{current.position}</p>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>

            <div className="mt-6 flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === active ? 'w-8 bg-fahrenheit' : 'w-2 bg-zero/20'
                  }`}
                  aria-label={`View testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-sol text-sol" />
                  ))}
                </div>
                <span className="text-2xl font-bold text-zero">5.0</span>
              </div>
              <p className="mt-1 text-sm text-zero/50">Google Rating</p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zero/70">Total Reviews</span>
                  <span className="text-lg font-bold text-zero">25+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zero/70">5-Star Reviews</span>
                  <span className="text-lg font-bold text-fahrenheit">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zero/70">Avg. Response</span>
                  <span className="text-lg font-bold text-zero">&lt; 48hr</span>
                </div>
              </div>

              <div className="mt-6 h-px bg-zero/10" />

              <a
                href="https://g.co/kgs/review"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-sol/10 px-4 py-3 text-sm font-semibold text-zero transition-colors hover:bg-sol/20"
              >
                Leave a Google Review
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
