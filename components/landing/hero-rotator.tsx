'use client';

import { useEffect, useState } from 'react';

const PHRASES = [
  'pays by smart contract.',
  'settles on-chain.',
  'publishes its pass rate.',
] as const;

const ROTATION_MS = 3600;
const TRANSITION_MS = 420;

export function HeroRotator() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'out' | 'pre'>('idle');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(media.matches);
    };

    update();
    media.addEventListener('change', update);

    return () => {
      media.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setPhase('out');

      window.setTimeout(() => {
        setPhraseIndex((current) => (current + 1) % PHRASES.length);
        setPhase('pre');
        window.requestAnimationFrame(() => {
          setPhase('idle');
        });
      }, TRANSITION_MS);
    }, ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [reducedMotion]);

  const phrase = PHRASES[phraseIndex];

  if (reducedMotion) {
    return (
      <>
        <span className="sr-only">{PHRASES[0]}</span>
        <span aria-hidden="true" className="h1-rot">
          <em className="rot">{PHRASES[0]}</em>
        </span>
      </>
    );
  }

  return (
    <>
      <span className="sr-only">{PHRASES[0]}</span>
      <span aria-hidden="true" className="h1-rot">
        <em className={`rot ${phase === 'out' ? 'out' : ''} ${phase === 'pre' ? 'pre' : ''}`}>
          {phrase}
        </em>
      </span>
    </>
  );
}
