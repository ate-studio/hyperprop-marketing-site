import { Comparison } from '@/components/landing/comparison';
import { Faq } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Hero } from '@/components/landing/hero';
import { Markets } from '@/components/landing/markets';
import { Nav } from '@/components/landing/nav';
import { Pricing } from '@/components/landing/pricing';
import { ProofStrip } from '@/components/landing/proof-strip';
import { Ticker } from '@/components/landing/ticker';
import { Transparency } from '@/components/landing/transparency';
import { Venue } from '@/components/landing/venue';
import { PAGE_REVALIDATE_SECONDS } from '@/lib/data/config';
import { getPageData } from '@/lib/data/page-data';

export const revalidate = PAGE_REVALIDATE_SECONDS;

export default async function Home() {
  const { markets, candles, proofMetrics } = await getPageData();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProofStrip metrics={proofMetrics} />
        <Venue />
        <Ticker rows={markets.data.rows} />
        <HowItWorks />
        <Pricing />
        <Transparency metrics={proofMetrics} />
        <Comparison />
        <Markets markets={markets} candles={candles} />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
