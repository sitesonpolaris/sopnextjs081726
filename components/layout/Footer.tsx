import Link from 'next/link';
import { Star, ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  services: [
    { href: '/services#design', label: 'High-Conversion Design' },
    { href: '/services#development', label: 'Enterprise Development' },
    { href: '/services#automation', label: 'Systems + Automation' },
  ],
  company: [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/meteor-house', label: 'Meteor House' },
    { href: '/contact', label: 'Contact' },
  ],
  resources: [
    { href: '/booking', label: 'Schedule Consultation' },
    { href: '/web-service-form', label: 'Start a Project' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-zero text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link href="/">
              <img
                src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/SOP_Logo_Full_RGB_SOP_Logo_Full_RGB_Red_Rev%20(1).png"
                alt="Sites on Polaris"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              We build high-conversion websites, enterprise applications, and automated systems that
              drive revenue for businesses in Charlotte, NC and beyond.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sol text-sol" />
                ))}
              </div>
              <span className="text-sm font-semibold text-sol">5.0</span>
              <span className="text-sm text-white/40">on Google</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-fahrenheit"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-fahrenheit"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 text-fahrenheit" />
                Charlotte, NC
              </li>
              <li>
                <a
                  href="mailto:hello@sitesonpolaris.com"
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-fahrenheit"
                >
                  <Mail className="h-4 w-4 text-fahrenheit" />
                  hello@sitesonpolaris.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+17042515030"
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-fahrenheit"
                >
                  <Phone className="h-4 w-4 text-fahrenheit" />
                  (704) 251-5030
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="https://g.co/kgs/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-sol transition-colors hover:bg-white/10"
              >
                Leave a Google Review
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Sites on Polaris. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-white/40 transition-colors hover:text-white/70">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-white/40 transition-colors hover:text-white/70">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
