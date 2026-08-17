import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function MeteorHouseSection() {
  const logoUrl = "https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/MH%20Logo%20for%20SoP.png";
  const heading = "Where Technology Meets Creativity";
  const description = "Meteor House is our creative arm, delivering stunning branding, logo design, motion graphics, and visual identity systems that set your business apart from the competition.";
  const primaryCtaText = "EXPLORE METEOR HOUSE";
  const primaryCtaLink = "/meteor-house";
  const secondaryCtaText = "VIEW OUR WORK";
  const secondaryCtaLink = "/portfolio";

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-light">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border-2 border-neutral-gray p-5 sm:p-6 md:p-8 lg:p-12 hover:border-accent-red transition-all duration-300 shadow-lg">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm font-semibold text-accent-red tracking-wider uppercase mb-3 sm:mb-4">Marketing Partner</p>
            <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
              <img
                src={logoUrl}
                alt="Meteor House - Marketing Partner"
                className="h-16 sm:h-20 md:h-24 w-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-neutral-dark">
              {heading.split(' ').map((word, index) =>
                word === 'Creativity' ? (
                  <span key={index} className="text-accent-red">{word}</span>
                ) : (
                  <React.Fragment key={index}>{word} </React.Fragment>
                )
              )}
            </h2>
            <p className="text-base sm:text-lg text-neutral-dark/70 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={primaryCtaLink}
              className="bg-accent-red text-white px-6 sm:px-8 py-3 font-bold text-sm tracking-wide hover:bg-neutral-dark transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-md min-h-[44px]"
            >
              {primaryCtaText}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href={secondaryCtaLink}
              className="border-2 border-neutral-dark text-neutral-dark px-6 sm:px-8 py-3 font-semibold text-sm tracking-wide hover:bg-neutral-dark hover:text-white transition-all duration-300 inline-flex items-center justify-center min-h-[44px]"
            >
              {secondaryCtaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
