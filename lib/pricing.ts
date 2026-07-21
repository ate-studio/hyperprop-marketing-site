export type AccountSizeK = 5 | 10 | 25 | 50 | 100;

export type PlanAccent = '' | 'sig' | 'prime';

export interface PricingPlan {
  name: string;
  sym?: string;
  badge: string;
  accent: PlanAccent;
  /** PENDING: pricing pending offer sheet — reference values are placeholders */
  price: Record<AccountSizeK, number>;
  rules: ReadonlyArray<readonly [string, string]>;
  foot: string;
}

export const ACCOUNT_SIZES: readonly AccountSizeK[] = [5, 10, 25, 50, 100] as const;

export const DEFAULT_ACCOUNT_SIZE: AccountSizeK = 25;

/** PENDING: pricing pending offer sheet — all figures ported verbatim from reference ACCTS */
export const PLANS: readonly PricingPlan[] = [
  {
    name: 'Desk Eval',
    sym: '\u03A3',
    badge: 'The front door',
    accent: 'sig',
    price: { 5: 30, 10: 55, 25: 125, 50: 240, 100: 475 },
    rules: [
      ['Pass by', 'Metrics'],
      ['Sample', '\u226560 trades \u00b7 \u226521d'],
      ['Daily loss \u00b7 EOD', '3%'],
      ['Max drawdown', '6% static'],
      ['Split', '80 \u2192 95%'],
    ],
    foot: 'Classifier credit accrues \u00b7 fast lane to live capital',
  },
  {
    name: '2-Step',
    badge: 'Cheapest sprint',
    accent: '',
    price: { 5: 45, 10: 85, 25: 180, 50: 340, 100: 680 },
    rules: [
      ['Pass by', '8% \u2192 5%'],
      ['Phases', '2'],
      ['Daily loss \u00b7 EOD', '5%'],
      ['Max drawdown', '10% static'],
      ['Split', '80 \u2192 95%'],
    ],
    foot: 'Widest risk room \u00b7 lowest sprint fee',
  },
  {
    name: '1-Step',
    badge: 'Fastest to funded',
    accent: '',
    price: { 5: 55, 10: 100, 25: 250, 50: 475, 100: 950 },
    rules: [
      ['Pass by', '10%'],
      ['Phases', '1'],
      ['Daily loss \u00b7 EOD', '4%'],
      ['Max drawdown', '6% static'],
      ['Split', '80 \u2192 95%'],
    ],
    foot: 'Volume SKU \u00b7 one clean pass',
  },
  {
    name: 'Prime 1-Step',
    badge: 'Premium terms',
    accent: 'prime',
    price: { 5: 105, 10: 190, 25: 475, 50: 900, 100: 1800 },
    rules: [
      ['Pass by', '8%'],
      ['Phases', '1'],
      ['Daily loss \u00b7 EOD', '5%'],
      ['Max drawdown', '10% static'],
      ['Split', '90 \u2192 95%'],
    ],
    foot: '90% split day one \u00b7 easier target \u00b7 wider room',
  },
] as const;

export function formatPlanPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}
