'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Eyebrow } from '@/components/ui/eyebrow';
import { Wrap } from '@/components/ui/wrap';
import { cn } from '@/lib/utils';

const MOBILE_BREAKPOINT = 760;

const STEPS = [
  {
    id: '1',
    theme: 'hw1',
    image: '/images/hiw-01.jpg',
    num: '01 — Today',
    title: 'Start a challenge',
    body: 'Pick a challenge from $5K to $100K. One-time fee. No time limit.',
    pending: 'confirm tiers',
  },
  {
    id: '2',
    theme: 'hw2',
    image: '/images/hiw-02.jpg',
    num: '02 — Your pace',
    title: 'Prove your edge',
    body: "Hit the profit target inside two limits: max daily loss and max drawdown. That's the entire rule set.",
  },
  {
    id: '3',
    theme: 'hw3',
    image: '/images/hiw-03.jpg',
    num: '03 — Instant upgrade',
    title: 'Get funded',
    body: 'Hit the target and the account funds itself — no forms, no review queue. Trade the funded account the same day.',
  },
  {
    id: '4',
    theme: 'hw4',
    image: '/images/hiw-04.jpg',
    num: '04 — On demand, on-chain',
    title: 'Get paid in USDC',
    body: 'Keep the majority of your gains. Payouts settle on-chain with a public transaction hash — verify every single one.',
    pending: 'confirm split % before naming a number',
  },
] as const;

export function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [staticLayout, setStaticLayout] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    const stack = stackRef.current;
    if (!track || !stack) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const applyLayout = () => {
      const shouldStatic =
        reducedMotion.matches || window.innerWidth <= MOBILE_BREAKPOINT;
      setStaticLayout(shouldStatic);

      if (shouldStatic) {
        stack.style.transform = '';
        return;
      }

      const cards = stack.children;
      const cardCount = cards.length;
      const rect = track.getBoundingClientRect();
      const scrollable = track.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      const progress = scrollable > 0 ? scrolled / scrollable : 0;
      const active = Math.max(
        0,
        Math.min(cardCount - 1, Math.floor(progress * cardCount)),
      );
      const cardHeight = (cards[0] as HTMLElement).offsetHeight;
      const gap = 24;
      stack.style.transform = `translateY(${-active * (cardHeight + gap)}px)`;
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          applyLayout();
        });
      }
    };

    applyLayout();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', applyLayout);
    reducedMotion.addEventListener('change', applyLayout);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', applyLayout);
      reducedMotion.removeEventListener('change', applyLayout);
    };
  }, []);

  return (
    <section
      id="how"
      className={cn('band overflow-visible py-section-y', staticLayout && 'hiw-static')}
    >
      <div className="sr-only" aria-hidden="true">
        {STEPS.map((step) => (
          <Image
            key={step.id}
            src={step.image}
            alt=""
            width={640}
            height={540}
            unoptimized
          />
        ))}
      </div>
      <div ref={trackRef} className="hiw-track">
        <div className="hiw-pin">
          <Wrap className="w-full">
            <div className="sec-head sec-head-copy">
              <Eyebrow>How it works</Eyebrow>
              <h2>Four steps to a funded account.</h2>
            </div>
            <div className="hiw-viewport">
              <div ref={stackRef} className="hiw-stack">
                {STEPS.map((step, index) => (
                  <article
                    key={step.id}
                    data-qa={index === 0 ? 'hiw-card-1' : undefined}
                    className={cn('hiw-card', step.theme)}
                    style={{ ['--i' as string]: index }}
                  >
                    <div className="hiw-copy">
                      <span className="hiw-num">{step.num}</span>
                      <h3>{step.title}</h3>
                      <p>
                        {step.body}
                        {'pending' in step && step.pending ? (
                          <>
                            {/* PENDING: confirm with CTO — {step.pending} */}
                          </>
                        ) : null}
                      </p>
                    </div>
                    <div
                      aria-hidden="true"
                      className="hiw-art"
                      style={{ backgroundImage: `url('${step.image}')` }}
                    />
                  </article>
                ))}
              </div>
            </div>
          </Wrap>
        </div>
      </div>
    </section>
  );
}
