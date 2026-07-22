import { Stat } from '@/components/ui/stat';
import { Wrap } from '@/components/ui/wrap';
import { formatIndexerProvenance } from '@/lib/data/format-provenance';
import type { Sourced } from '@/lib/data/sourced';
import { formatDuration, formatPassRate, formatUsd } from '@/lib/format';
import type { ProofMetrics } from '@/lib/types';

export interface ProofStripProps {
  metrics: Sourced<ProofMetrics>;
}

export function ProofStrip({ metrics }: ProofStripProps) {
  const values = metrics.data;

  return (
    <section data-qa="proof-strip" className="stats">
      <Wrap className="py-0">
        <div className="stats-grid">
          <Stat
            label="Reserve balance"
            value={formatUsd(values.reserveBalanceUsd)}
            filled={8}
          />
          <Stat
            label="Total paid out"
            value={formatUsd(values.totalPaidOutUsd)}
            valueClassName="up"
            filled={10}
          />
          <Stat
            label="Median time-to-pay"
            value={formatDuration(values.medianTimeToPayMinutes)}
            filled={7}
          />
          <Stat
            label="Published pass rate"
            value={formatPassRate(values.publishedPassRatePct)}
            filled={2}
          />
        </div>
        <p className="data-provenance">
          {formatIndexerProvenance(metrics.source, metrics.asOf)}
        </p>
      </Wrap>
    </section>
  );
}
