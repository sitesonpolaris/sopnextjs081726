'use client';

import { useEffect, useRef, useState } from 'react';
import { Lightbulb, Target, Zap, TrendingUp } from 'lucide-react';

interface Solution {
  icon: React.ReactNode;
  title: string;
  description: string;

}

interface SolutionCardProps extends Solution {
  index: number;
}

function SolutionCard({ icon, title, description, index }: SolutionCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 150);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`bg-neutral-light p-6 sm:p-8 border-l-4 border-accent-red shadow-lg hover:shadow-xl transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent-red/10 flex items-center justify-center text-accent-red">
          {icon}
        </div>
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-dark mb-2">
            {title}
          </h3>
          <p className="text-neutral-dark/70 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>
      </div>
     
    </div>
  );
}

export function SolutionsSection() {
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  const heading = "That's where we come in.";
  const subheading = "We don't just \"build websites.\"";
  const introText = "We create conversion-focused websites and continuously improve them so they generate real business results.";

  const solutions: Solution[] = [
    {
      icon: <Target className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Clear messaging",
      description: "Your value proposition is instantly understood.",
      
    },
    {
      icon: <Zap className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Lightning-Fast Performance",
      description: "Speed matters. We build websites that load instantly and keep visitors engaged.",
      
    },
    {
      icon: <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Strong calls-to-action",
      description: "Strategic placement that guides visitors to convert.",
      
    },
    {
      icon: <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Ongoing improvements",
      description: "Based on real user behavior and performance data.",
  
      
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeadingVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="solutionSection" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div
          ref={headingRef}
          className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-700 ${
            isHeadingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-neutral-dark mb-4 sm:mb-6 leading-tight">
            {heading}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-dark/80 font-semibold mb-3 sm:mb-4 max-w-3xl mx-auto leading-snug">
            {subheading}
          </p>
          <p className="text-base sm:text-lg md:text-xl text-neutral-dark/70 max-w-3xl mx-auto leading-relaxed">
            {introText}
          </p>
        </div>

        <div className="mb-6 sm:mb-8 md:mb-12 text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-accent-red mb-2">
            Our approach is simple:
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {solutions.map((solution, index) => (
            <SolutionCard key={index} {...solution} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
