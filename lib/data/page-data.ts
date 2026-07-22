import { DATA_MODE } from '@/lib/data/config';
import {
  getFeaturedCandles,
  getMarketsSnapshot,
} from '@/lib/data/hyperliquid';
import { getProofMetrics } from '@/lib/data/indexer';
import type { Sourced } from '@/lib/data/sourced';
import type { CandlePoint } from '@/lib/market-candles';
import type { ProofMetrics } from '@/lib/types';

import type { MarketsSnapshot } from '@/lib/data/hyperliquid';

export interface PageData {
  markets: Sourced<MarketsSnapshot>;
  candles: Sourced<CandlePoint[]>;
  proofMetrics: Sourced<ProofMetrics>;
}

export async function getPageData(): Promise<PageData> {
  const [markets, candles, proofMetrics] = await Promise.all([
    getMarketsSnapshot(DATA_MODE),
    getFeaturedCandles(DATA_MODE),
    getProofMetrics(DATA_MODE),
  ]);

  return {
    markets,
    candles,
    proofMetrics,
  };
}

export type { MarketsSnapshot };
