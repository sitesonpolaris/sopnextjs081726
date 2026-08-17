import { HeroSection } from '@/components/home/HeroSection';
import { ProblemSection } from '@/components/home/ProblemSection';
import { SolutionsSection } from '@/components/home/SolutionsSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { TechStackSection } from '@/components/home/TechStackSection';
import { PortfolioShowcase } from '@/components/home/PortfolioShowcase';
import { MeteorHouseSection } from '@/components/home/MeteorHouseSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionsSection />
      {/* <ServicesSection /> */} 
      <TechStackSection />
      <PortfolioShowcase />
      <MeteorHouseSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
