import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Theme tokens',
  robots: {
    index: false,
    follow: false,
  },
};

function ThemeDemoCard() {
  return (
    <article className="rounded-lg border border-line bg-paper-raised p-6 shadow-1">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-60">
        Theme demo
      </p>
      <h1 className="mt-3 font-serif text-5xl font-normal leading-[1.06] tracking-[-0.018em] text-ink">
        Token architecture proof
      </h1>
      <div className="mt-6 border-b border-line pb-3">
        <div className="flex items-baseline justify-between gap-4 font-mono text-sm">
          <span className="text-ink-60">Payout</span>
          <span className="num text-up">+$4,218.00</span>
        </div>
      </div>
      <a
        href="#"
        className="mt-3 inline-block font-mono text-sm text-blueprint"
      >
        0x9f3a…c812
      </a>
      <p className="mt-6 font-sans text-md text-ink-60">
        This card reads design tokens only. Parent section theme is controlled
        exclusively by whether <code className="font-mono text-sm">sec-invert</code>{' '}
        is present on the wrapper.
      </p>
    </article>
  );
}

export default function TokensPage() {
  return (
    <div className="mx-auto max-w-maxw px-7 py-section-y">
      <section className="py-section-y-phone">
        <ThemeDemoCard />
      </section>
      <section className="sec-invert py-section-y-phone">
        <ThemeDemoCard />
      </section>
    </div>
  );
}
