import { z } from 'zod';

import {
  FETCH_TIMEOUT_MS,
  NORTHBOOK_INDEXER_URL,
} from '@/lib/data/config';
import { PLACEHOLDER_PROOF_METRICS } from '@/lib/proof-metrics';
import {
  liveEnvelope,
  placeholderEnvelope,
  type Sourced,
} from '@/lib/data/sourced';
import type { PayoutLedgerEntry, ProofMetrics } from '@/lib/types';

// PENDING: confirm with CTO — indexer endpoint shapes before backend build

const ProofMetricsSchema = z.object({
  reserveBalanceUsd: z.number(),
  totalPaidOutUsd: z.number(),
  medianTimeToPayMinutes: z.number(),
  publishedPassRatePct: z.number(),
  monthlyPaidOutUsd: z.number(),
  payoutCount30d: z.number(),
});

const PayoutLedgerEntrySchema = z.object({
  settledAt: z.string(),
  traderTag: z.string(),
  amountUsdc: z.number(),
  txHash: z.string(),
  txUrl: z.string().url(),
});

const RecentPayoutsSchema = z.array(PayoutLedgerEntrySchema);

async function fetchIndexer<T>(
  path: string,
  schema: z.ZodType<T>,
): Promise<Sourced<T> | null> {
  if (!NORTHBOOK_INDEXER_URL) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(`${NORTHBOOK_INDEXER_URL}${path}`, {
      signal: controller.signal,
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return null;
    }

    const json: unknown = await response.json();
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
      return null;
    }

    return liveEnvelope(parsed.data, new Date().toISOString());
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getProofMetrics(
  mode: 'live' | 'placeholder',
): Promise<Sourced<ProofMetrics>> {
  if (mode === 'placeholder') {
    return placeholderEnvelope(PLACEHOLDER_PROOF_METRICS);
  }

  const live = await fetchIndexer('/v1/proof-metrics', ProofMetricsSchema);
  return live ?? placeholderEnvelope(PLACEHOLDER_PROOF_METRICS);
}

export async function getRecentPayouts(
  mode: 'live' | 'placeholder',
): Promise<Sourced<PayoutLedgerEntry[]>> {
  if (mode === 'placeholder') {
    return placeholderEnvelope([]);
  }

  const live = await fetchIndexer(
    '/v1/payouts/recent?limit=12',
    RecentPayoutsSchema,
  );
  return live ?? placeholderEnvelope([]);
}

export { ProofMetricsSchema, PayoutLedgerEntrySchema, RecentPayoutsSchema };
