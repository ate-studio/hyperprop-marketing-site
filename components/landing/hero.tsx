import Image from 'next/image';

import { HeroRotator } from '@/components/landing/hero-rotator';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Wrap } from '@/components/ui/wrap';

export function Hero() {
  return (
    <header data-qa="hero" className="hero">
      <div aria-hidden="true" className="hero-bg">
        {/* PENDING: confirm with CTO — final Northbook brand imagery */}
        <Image
          src="/images/hero-markets.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div aria-hidden="true" className="hero-scrim" />
      <Wrap className="hero-in">
        <div className="hero-bottom">
          <div className="hero-copy">
            <Eyebrow className="hero-eyebrow-muted hero-eyebrow-wrap">
              Crypto-native proprietary trading · 24/7
            </Eyebrow>
            <h1>
              The prop firm that <HeroRotator />
            </h1>
            <p className="hero-sub">
              Trade up to $100,000 of crypto perpetual capital on real exchange
              liquidity. Published pass rates, on-chain USDC payouts, rules you
              can read in five minutes.
              {/* PENDING: confirm with CTO — $100,000 cap claim */}
            </p>
            <div className="hero-ctas">
              <Button href="#pricing" variant="primary">
                Start a challenge
              </Button>
              <Button href="#transparency" variant="ghost">
                Read the rules -&gt;
              </Button>
            </div>
          </div>
          <div className="hero-cards">
            <div className="glass hero-card">
              <div
                aria-label="$8,412,930 capital deployed"
                className="odo"
                id="hero-odo"
              >
                $8,412,930
              </div>
              <p className="hc-cap">
                Capital deployed to traders. Every payout behind this number is
                verifiable on-chain.
                {/* PENDING: confirm with CTO — wire to indexer API */}
              </p>
            </div>
            <div className="glass hero-card">
              <Eyebrow className="hero-eyebrow-dim hero-card-eyebrow">
                Latest settlement
              </Eyebrow>
              <p className="hc-line">
                <span className="up">+1,247.83 USDC</span> · trader ···7f2a
              </p>
              <p className="hc-line">
                <span className="acc-link">0x94c1…e07</span> · settled 3h 51m
                after request
                {/* PENDING: confirm with CTO — explorer URLs */}
              </p>
              <p className="hc-cap hero-card-foot">
                $412,908 paid this month · 32 payouts ·{' '}
                <a href="#transparency" className="acc-link">
                  Verify -&gt;
                </a>
              </p>
            </div>
          </div>
        </div>
      </Wrap>
    </header>
  );
}
