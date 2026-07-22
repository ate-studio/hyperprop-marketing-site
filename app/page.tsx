import { Comparison } from '@/components/landing/comparison';
import { Faq } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Hero } from '@/components/landing/hero';
import { Markets } from '@/components/landing/markets';
import { Nav } from '@/components/landing/nav';
import { Pricing } from '@/components/landing/pricing';
import { ProofStrip } from '@/components/landing/proof-strip';
import { Transparency } from '@/components/landing/transparency';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProofStrip />
        <HowItWorks />
        <Pricing />
        <Transparency />
        <Comparison />
        <Markets />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
