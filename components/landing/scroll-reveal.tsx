'use client';

import { useEffect } from 'react';

const STAGGER_MS = 80;
const REVEAL_SELECTOR = '.rv, .rv-scale, [data-stagger]';

function applyStagger(target: Element) {
  Array.from(target.children).forEach((child, index) => {
    const element = child as HTMLElement;
    element.style.transitionDelay = `${index * STAGGER_MS}ms`;
    window.setTimeout(() => {
      element.style.transitionDelay = '0ms';
    }, index * STAGGER_MS + 600);
  });
}

function revealTarget(target: Element) {
  if (target.classList.contains('in')) {
    return;
  }

  target.classList.add('in');

  if (target.hasAttribute('data-stagger')) {
    applyStagger(target);
  }
}

function revealAll() {
  document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
    revealTarget(element);
  });
}

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < viewHeight * 0.92 && rect.bottom > viewHeight * 0.08;
}

function revealVisible() {
  document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
    if (isInViewport(element)) {
      revealTarget(element);
    }
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

          revealTarget(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    const observeAll = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (!element.classList.contains('in')) {
          observer.observe(element);
        }
      });
      revealVisible();
    };

    observeAll();

    let scrollTicking = false;
    const onScroll = () => {
      if (scrollTicking) {
        return;
      }

      scrollTicking = true;
      requestAnimationFrame(() => {
        scrollTicking = false;
        revealVisible();
      });
    };

    const onError = () => {
      revealAll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('error', onError);
    window.addEventListener('load', observeAll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('error', onError);
      window.removeEventListener('load', observeAll);
    };
  }, []);

  return null;
}
