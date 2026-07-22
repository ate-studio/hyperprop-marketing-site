import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Wrap } from '@/components/ui/wrap';
import { formatIndexerProvenance } from '@/lib/data/format-provenance';
import type { Sourced } from '@/lib/data/sourced';
import { formatPassRate, formatUsd } from '@/lib/format';
import {
  formatLedgerAmount,
  LEDGER_PLACEHOLDER,
  PAYOUT_CHART_LABELS,
  PAYOUT_DAYS,
} from '@/lib/transparency';
import type { ProofMetrics } from '@/lib/types';

export interface TransparencyProps {
  metrics: Sourced<ProofMetrics>;
  payoutDays?: readonly number[];
}

function PayoutChart({ payoutDays }: { payoutDays: readonly number[] }) {
  const maxDay = Math.max(...payoutDays);

  return (
    <>
      <h3 className="trans-subhead">Payouts by day — last 30 days</h3>
      <div className="dm-chart" aria-hidden="true">
        {payoutDays.map((count, index) => (
          <div
            key={`day-${index}`}
            className={cnDmCol(count, maxDay)}
          >
            {Array.from({ length: count }, (_, dotIndex) => (
              <i key={`dot-${index}-${dotIndex}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="dm-labels">
        {PAYOUT_CHART_LABELS.map((label) => (
          <span key={label} className="dm-lab">
            {label}
          </span>
        ))}
      </div>
    </>
  );
}

function cnDmCol(count: number, maxDay: number): string {
  if (count === maxDay) {
    return 'dm-col hi';
  }
  if (count <= 4) {
    return 'dm-col dim';
  }
  return 'dm-col';
}

export function Transparency({
  metrics,
  payoutDays = PAYOUT_DAYS,
}: TransparencyProps) {
  const values = metrics.data;

  return (
    <section
      id="transparency"
      data-qa="transparency"
      className="sec-pad trans sec-invert"
    >
      <Wrap>
        <div className="sec-head sec-head-copy">
          <Eyebrow>Transparency</Eyebrow>
          <h2>Numbers we publish. Most firms don&apos;t.</h2>
          <p>
            Pass rates, payouts, and breach data — published live, because a
            firm that pays traders has nothing to hide from them.
          </p>
        </div>

        <div className="trans-grid">
          <div className="trans-panel">
            <h3>Payout ledger — settled on-chain</h3>
            {LEDGER_PLACEHOLDER.map((entry) => (
              <div key={`${entry.settledAt}-${entry.txHash}`} className="feed-row">
                <span className="t">{entry.settledAt}</span>
                <span>{entry.traderTag}</span>
                <span className="amt">{formatLedgerAmount(entry.amountUsdc)}</span>
                <Link href={entry.txUrl} className="tx">
                  {entry.txHash} -&gt;
                </Link>
              </div>
            ))}
            <div className="ledger-cta">
              {/* PENDING: confirm with CTO — full transparency page URL */}
              <Button href="#" variant="ghost">
                View full transparency page -&gt;
              </Button>
            </div>
          </div>

          <div className="trans-panel">
            <h3>This month, in public</h3>
            <div className="big-metric">
              <div className="bm">
                <div className="v num">{formatUsd(values.monthlyPaidOutUsd)}</div>
                <div className="l">Paid out</div>
              </div>
              <div className="bm">
                <div className="v num">
                  {formatPassRate(values.publishedPassRatePct)}
                </div>
                <div className="l">Pass rate</div>
              </div>
              <div className="bm">
                <div className="v num">{values.payoutCount30d}</div>
                <div className="l">Payouts</div>
              </div>
            </div>

            <p className="data-provenance data-provenance-panel">
              {formatIndexerProvenance(metrics.source, metrics.asOf)}
            </p>

            <PayoutChart payoutDays={payoutDays} />

            <div className="vault-sep" />

            <h3 className="trans-vault-head">ReserveVault &amp; settlement</h3>
            <div className="vault-lead">
              Solvency you can <em>audit yourself.</em>
            </div>
            <p className="vault-copy">
              A public on-chain USDC vault held at ≥15–20% of all funded
              capital — multiples above expected liability. Payouts settle on
              demand, in minutes, with a public tx hash.
              {/* PENDING: confirm with CTO — reserve ≥15–20% claim */}
            </p>
            <div className="vaultbar">
              <span className="vb-need" />
              <span className="vb-fill" />
            </div>
            <div className="vaultlegend">
              <span>
                <i className="need" aria-hidden="true" />
                Expected liability
              </span>
              <span>
                <i className="fill" aria-hidden="true" />
                Vault ≥15–20% of funded
              </span>
            </div>
            <div className="vaulttx">
              0x3fa2…9c41 · PAYOUT · 925.00 USDC ·{' '}
              {/* PENDING: confirm with CTO — explorer URL */}
              <Link href="#" className="vtx">
                VERIFY TX ↗
              </Link>{' '}
              · &lt;5 min request → wallet
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
