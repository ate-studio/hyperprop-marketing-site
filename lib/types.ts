export interface ProofMetrics {
  reserveBalanceUsd: number;
  totalPaidOutUsd: number;
  medianTimeToPayMinutes: number;
  publishedPassRatePct: number;
  monthlyPaidOutUsd: number;
  payoutCount30d: number;
}

/** Consumed in Sprint 2 */
export interface PayoutLedgerEntry {
  settledAt: string;
  traderTag: string;
  amountUsdc: number;
  txHash: string;
  txUrl: string;
}
