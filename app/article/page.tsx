'use client';
import React, { useEffect, useState } from 'react';
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
import { heroContent as staticHero, painPoints as staticPain, featuresContent as staticFeatures, testimonialsContent as staticTestimonials, pricingContent as staticPricing } from '@/data/content';

export const dynamic = 'force-dynamic';

export default function ArticlePage() {
  const [product, setProduct] = useState<any>(null);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/product').then(r => r.json()).then(setProduct).catch(() => {});
    fetch('/api/landing-content').then(r => r.json()).then(setContent).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <CountdownTimer />
      <main>
        <HeroSection product={product} heroContent={content?.hero} />
        <PainPoints data={content?.pain_points} />
        <Features data={content?.features} />
        <Testimonials data={content?.testimonials} />
        <PricingTable product={product} data={content?.pricing} />
        <FAQ />
      </main>
      <Footer />
      <FloatingBuyCard product={product} />
    </>
  );
}
