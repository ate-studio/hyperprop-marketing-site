import { Stat } from '@/components/ui/stat';
import { Wrap } from '@/components/ui/wrap';
import { formatDuration, formatPassRate, formatUsd } from '@/lib/format';
import { PLACEHOLDER_PROOF_METRICS } from '@/lib/proof-metrics';
import type { ProofMetrics } from '@/lib/types';

export interface ProofStripProps {
  metrics?: ProofMetrics;
}

export function ProofStrip({ metrics = PLACEHOLDER_PROOF_METRICS }: ProofStripProps) {
  return (
    <section data-qa="proof-strip" className="stats">
      <Wrap className="py-0">
        <div className="stats-grid">
          <Stat
            label="Reserve balance"
            value={formatUsd(metrics.reserveBalanceUsd)}
            filled={8}
          />
          <Stat
            label="Total paid out"
            value={formatUsd(metrics.totalPaidOutUsd)}
            valueClassName="up"
            filled={10}
          />
          <Stat
            label="Median time-to-pay"
            value={formatDuration(metrics.medianTimeToPayMinutes)}
            filled={7}
          />
          <Stat
            label="Published pass rate"
            value={formatPassRate(metrics.publishedPassRatePct)}
            filled={2}
          />
        </div>
      </Wrap>
    </section>
  );
}
