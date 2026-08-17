'use client';

import { cn } from '@/lib/utils';

const categories = [
  'All',
  'Nonprofit',
  'E-commerce',
  'Educational',
  'Consulting',
  'Food & Beverage',
  'Event Services',
  'Professional Services',
  'Property Management',
  'Professional Networking',
];

interface PortfolioFilterProps {
  active: string;
  onChange: (category: string) => void;
}

export function PortfolioFilter({ active, onChange }: PortfolioFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all',
            active === cat
              ? 'bg-fahrenheit text-white shadow-md'
              : 'bg-zero/5 text-zero/60 hover:bg-zero/10 hover:text-zero'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
