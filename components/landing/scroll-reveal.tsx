'use client';

import { useEffect } from 'react';

const STAGGER_MS = 80;
const REVEAL_SELECTOR = '.rv, .rv-scale, [data-stagger]';

function revealAll() {
  document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
    element.classList.add('in');
  });
}

export function ScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotion.matches) {
      revealAll();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target;
          target.classList.add('in');

          if (target.hasAttribute('data-stagger')) {
            Array.from(target.children).forEach((child, index) => {
              const element = child as HTMLElement;
              element.style.transitionDelay = `${index * STAGGER_MS}ms`;
              window.setTimeout(() => {
                element.style.transitionDelay = '0ms';
              }, index * STAGGER_MS + 600);
            });
          }

          observer.unobserve(target);
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
      observer.observe(element);
    });

    const onError = () => {
      revealAll();
    };

    window.addEventListener('error', onError);

    return () => {
      observer.disconnect();
      window.removeEventListener('error', onError);
    };
  }, []);

  return null;
}
