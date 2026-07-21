import type { PayoutLedgerEntry } from '@/lib/types';

/** Reference `days` array — last 30 days payout chart (verbatim) */
export const PAYOUT_DAYS: readonly number[] = [
  5, 7, 6, 9, 8, 4, 3, 8, 10, 9, 12, 11, 5, 4, 9, 11, 13, 12, 15, 7, 5, 10,
  12, 11, 14, 13, 6, 5, 11, 13,
] as const;

export const PAYOUT_CHART_LABELS = [
  'JUN 18',
  'JUN 28',
  'JUL 07',
  'JUL 17',
] as const;

// PENDING: wire to indexer API
export const LEDGER_PLACEHOLDER: readonly PayoutLedgerEntry[] = [
  {
    settledAt: '14:02',
    traderTag: 'trader ···7f2a',
    amountUsdc: 1247.83,
    txHash: '0x94c1…e07',
    txUrl: '#',
  },
  {
    settledAt: '13:41',
    traderTag: 'trader ···b90c',
    amountUsdc: 3082.1,
    txHash: '0x1aa8…4fd',
    txUrl: '#',
  },
  {
    settledAt: '12:58',
    traderTag: 'trader ···44de',
    amountUsdc: 512.44,
    txHash: '0x77b2…c11',
    txUrl: '#',
  },
  {
    settledAt: '12:12',
    traderTag: 'trader ···09aa',
    amountUsdc: 6904.51,
    txHash: '0xe30d…981',
    txUrl: '#',
  },
  {
    settledAt: '11:47',
    traderTag: 'trader ···c3f1',
    amountUsdc: 998.0,
    txHash: '0x52f7…a6c',
    txUrl: '#',
  },
  {
    settledAt: '11:20',
    traderTag: 'trader ···e881',
    amountUsdc: 2411.09,
    txHash: '0x8be0…3d2',
    txUrl: '#',
  },
  {
    settledAt: '10:54',
    traderTag: 'trader ···19bd',
    amountUsdc: 745.62,
    txHash: '0xa471…90e',
    txUrl: '#',
  },
  {
    settledAt: '10:31',
    traderTag: 'trader ···6c0a',
    amountUsdc: 4120.0,
    txHash: '0x3f95…b17',
    txUrl: '#',
  },
  {
    settledAt: '09:58',
    traderTag: 'trader ···d24f',
    amountUsdc: 1530.77,
    txHash: '0xc628…44a',
    txUrl: '#',
  },
  {
    settledAt: '09:31',
    traderTag: 'trader ···a7e3',
    amountUsdc: 2864.2,
    txHash: '0xb914…2f8',
    txUrl: '#',
  },
  {
    settledAt: '09:07',
    traderTag: 'trader ···5b1c',
    amountUsdc: 1073.95,
    txHash: '0x2de6…7a0',
    txUrl: '#',
  },
  {
    settledAt: '08:44',
    traderTag: 'trader ···f10e',
    amountUsdc: 689.3,
    txHash: '0x9c47…e52',
    txUrl: '#',
  },
] as const;

export function formatLedgerAmount(amountUsdc: number): string {
  const formatted = amountUsdc.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `+${formatted} USDC`;
}
