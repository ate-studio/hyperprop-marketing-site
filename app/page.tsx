import { HowItWorks } from '@/components/landing/how-it-works';
import { Hero } from '@/components/landing/hero';
import { Nav } from '@/components/landing/nav';
import { ProofStrip } from '@/components/landing/proof-strip';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProofStrip />
        <HowItWorks />
      </main>
    </>
  );
}
