'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  video_url?: string;
  tags: string[];
  client_name: string;
  order_index: number;
  is_featured: boolean;
}

export default function PortfolioSliderMH() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { data, error } = await supabase
          .from('meteor_house_portfolio')
          .select('*')
          .eq('published', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  if (loading) {
    return (
      <div className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-neutral-dark">
            Our <span className="text-accent-red">Portfolio</span>
          </h2>
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-neutral-dark">
            Our <span className="text-accent-red">Portfolio</span>
          </h2>
          <div className="text-center py-12">
            <p className="text-neutral-dark/70">Portfolio items coming soon!</p>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-neutral-dark">
          Our <span className="text-accent-red">Portfolio</span>
        </h2>

        <div className="relative">
          <Card className="border-2 border-neutral-gray overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative aspect-square md:aspect-auto min-h-[300px] md:min-h-[400px] bg-neutral-light">
                {currentItem.video_url ? (
                  <video
                    key={currentItem.id}
                    src={currentItem.video_url}
                    poster={currentItem.image_url}
                    controls
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={currentItem.image_url}
                    alt={currentItem.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center bg-white">
                <Badge className="w-fit mb-4 bg-accent-red/10 text-accent-red border-accent-red/20 hover:bg-accent-red/20">
                  {currentItem.category}
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-dark">
                  {currentItem.title}
                </h3>
                {currentItem.client_name && (
                  <p className="text-sm text-neutral-dark/60 mb-3">
                    Client: {currentItem.client_name}
                  </p>
                )}
                <p className="text-neutral-dark/70 mb-6 leading-relaxed">
                  {currentItem.description}
                </p>
                {currentItem.tags && currentItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {currentItem.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-neutral-gray text-neutral-dark"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {items.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-neutral-gray hover:border-accent-red"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-neutral-gray hover:border-accent-red"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>

        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-accent-red w-8'
                    : 'bg-neutral-gray hover:bg-accent-red/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
