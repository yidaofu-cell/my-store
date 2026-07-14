import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { PainPoints } from '@/components/landing/PainPoints';
import { Features } from '@/components/landing/Features';
import { Testimonials } from '@/components/landing/Testimonials';
import { PricingTable } from '@/components/landing/PricingTable';
import { FAQ } from '@/components/landing/FAQ';
import { CountdownTimer } from '@/components/landing/CountdownTimer';
import { FloatingBuyCard } from '@/components/landing/FloatingBuyCard';

export default function ArticlePage() {
  return (
    <>
      <Header />
      <CountdownTimer />
      <main>
        <HeroSection />
        <PainPoints />
        <Features />
        <Testimonials />
        <PricingTable />
        <FAQ />
      </main>
      <Footer />
      <FloatingBuyCard />
    </>
  );
}
