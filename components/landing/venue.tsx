import { Eyebrow } from '@/components/ui/eyebrow';
import { Wrap } from '@/components/ui/wrap';
import { HyperliquidLogo } from '@/components/landing/hyperliquid-logo';

export function Venue() {
  return (
    <section className="venue" data-qa="venue">
      <Wrap className="venue-shell">
        <Eyebrow>Powered by</Eyebrow>
        <HyperliquidLogo />
      </Wrap>
    </section>
  );
}
