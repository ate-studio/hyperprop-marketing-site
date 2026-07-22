import Link from 'next/link';

import { JoinForm } from '@/components/landing/join-form';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Wrap } from '@/components/ui/wrap';

function DiscordIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.317 4.369a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.446.865-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.369a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.291.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.891.077.077 0 00-.041.107 15.8 15.8 0 001.226 1.993.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function Join() {
  return (
    <section id="join" data-qa="join" className="sec-pad band">
      <Wrap>
        <div className="join-grid">
          <div className="join-panel">
            <Eyebrow>The list</Eyebrow>
            <h3>Join our mailing list.</h3>
            <p>
              Get the full rulebook and the monthly transparency report.
              {/* PENDING: confirm with CTO — launch promo, restore line if approved */}
            </p>
            <JoinForm />
          </div>

          <div className="join-panel join-discord">
            <Eyebrow>Community &amp; support</Eyebrow>
            <h3>Join our Discord.</h3>
            <p>Real-time updates, chart talk, and 24/7 support.</p>
            {/* PENDING: confirm with CTO — Discord invite URL */}
            <Link href="#" className="btn btn-discord">
              <DiscordIcon />
              Join Discord
            </Link>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
