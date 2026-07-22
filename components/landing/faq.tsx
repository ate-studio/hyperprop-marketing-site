'use client';

import { useId, useState } from 'react';

import { Eyebrow } from '@/components/ui/eyebrow';
import { Wrap } from '@/components/ui/wrap';

const FAQ_ITEMS = [
  {
    question: 'What is a prop firm?',
    answer:
      'A proprietary trading firm provides the capital so you can trade larger than your own account allows. You pass an evaluation to prove skill and risk discipline, then trade a funded account and keep most of the gains. You bring the skill; we bring the capital.',
  },
  {
    question: 'Can I lose my own money?',
    answer:
      'No. The only money you ever put in is the one-time evaluation fee. Evaluations and funded accounts run in a simulated environment, so there are no margin calls, no deposits, and no surprise bills. The worst case is that an account hits its loss limit and closes.',
  },
  {
    question: 'What do I trade, and where does the liquidity come from?',
    answer:
      '70+ crypto perpetual futures markets, 24/7, priced against real centralized-exchange order books — tight spreads, visible depth, and executions that reflect actual market conditions rather than a synthetic feed.',
  },
  {
    question: 'How do payouts work?',
    answer:
      'Request a payout from your dashboard; it settles in USDC on-chain with a public transaction hash. Your first payout is available 7 days after funding, then weekly on demand. Every payout ever made is listed on our transparency page.',
  },
  {
    question: 'What happens if I break a rule?',
    answer:
      "The account closes — that's all. There are exactly two limits: max daily loss and max drawdown. No hidden penalties, no clawbacks, no one chasing you for money. You can start a new evaluation whenever you're ready.",
  },
  {
    question: 'Which countries are eligible?',
    answer:
      'We serve most jurisdictions worldwide, with restrictions for sanctioned regions and certain markets listed in the rulebook. The full eligibility list is published on the rules page and checked at signup — before you pay, not after you win.',
  },
] as const;

export function Faq() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" data-qa="faq" className="sec-pad">
      <Wrap>
        <div className="sec-head sec-head-copy">
          <Eyebrow>FAQ</Eyebrow>
          <h2>Plain answers.</h2>
        </div>

        <div id="faq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `${baseId}-answer-${index}`;

            return (
              <div
                key={item.question}
                className="faq-item"
                data-open={isOpen ? 'true' : 'false'}
              >
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => {
                    setOpenIndex(isOpen ? null : index);
                  }}
                >
                  {item.question}
                  <span className="mark">+</span>
                </button>
                <div id={answerId} className="faq-a">
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}
