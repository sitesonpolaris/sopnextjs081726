'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface Problem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ProblemCardProps extends Problem {
  delay: number;
}

function ProblemCard({ icon, title, description, delay }: ProblemCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`bg-white p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent-red/10 flex items-center justify-center text-accent-red">
          {icon}
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-dark mb-2">
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

export function ProblemSection() {
  const [isVisible, setIsVisible] = useState(false);
  const statementRef = useRef<HTMLDivElement>(null);

  const heading = "Does this sound familiar?";

  const problems: Problem[] = [
    {
      icon: <X className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Looks Fine, But No Results",
      description: "Your website looks fine… but barely brings in calls or form submissions."
    },
    {
      icon: <X className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Built Once, Then Forgotten",
      description: "You paid for a site once, and now it just sits there."
    },
    {
      icon: <X className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Mobile Visitors Bounce",
      description: "Mobile visitors leave without contacting you."
    },
    {
      icon: <X className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Ads Don't Convert",
      description: "You're spending money on ads, but your site isn't converting."
    }
  ];

  const closingStatement = "Most business websites don't fail because of traffic — they fail because they aren't built to convert.";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (statementRef.current) {
      observer.observe(statementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 bg-accent-red rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-neutral-dark rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-neutral-dark mb-4 leading-tight">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
          {problems.map((problem, index) => (
            <ProblemCard key={index} {...problem} delay={index * 100} />
          ))}
        </div>

        <div
          ref={statementRef}
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-neutral-dark p-6 sm:p-8 md:p-12 border-l-4 border-accent-red">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed">
              {closingStatement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
