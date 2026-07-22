'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Wrap } from '@/components/ui/wrap';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#transparency', label: 'Transparency' },
  { href: '#how', label: 'How it works' },
  { href: '#markets', label: 'Markets' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 60);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <nav data-qa="nav" className={cn(scrolled && 'scrolled')}>
      <Wrap className="nav-shell">
        <Link href="/" className="logo-text">
          <span aria-hidden="true" className="logo-mark" />
          Northbook
        </Link>
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-cta">
          {/* PENDING: confirm with CTO — sign-in destination */}
          <Button href="#" variant="ghost">
            Sign in
          </Button>
          <Button href="#pricing" variant="primary">
            Start a challenge
          </Button>
        </div>
      </Wrap>
    </nav>
  );
}
