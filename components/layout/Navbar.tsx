'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/web-design-development', label: 'Web Design & Development' },
  { href: '/website-optimization', label: 'Website Optimization' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/meteor-house', label: 'Meteor House' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isServicePage = pathname === '/web-design-development' || pathname === '/website-optimization';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isServicePage
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/SOP_Logo_Full_RGB_SOP_Logo_Full_RGB_Red.png"
              alt="Sites on Polaris"
              className="h-8 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zero/80 transition-colors hover:bg-zero/5 hover:text-zero"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button asChild variant="outline" className="border-fahrenheit text-fahrenheit hover:bg-fahrenheit hover:text-white gap-2">
              <Link href="/booking">
                Free Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-zero transition-colors hover:bg-zero/5 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white lg:hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
              <img
                src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/SOP_Logo_Full_RGB_SOP_Logo_Full_RGB_Red.png"
                alt="Sites on Polaris"
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-zero transition-colors hover:bg-zero/5"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-2 px-6 pt-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-lg font-medium text-zero/80 transition-colors hover:bg-zero/5 hover:text-zero"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6">
              <Button asChild className="w-full bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
                <Link href="/booking" onClick={() => setMobileOpen(false)}>
                  Free Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
