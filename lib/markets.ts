// PENDING: wire to indexer API — snapshot values, not live.

export interface MarketRow {
  symbol: string;
  name: string;
  lastPrice: number;
  change24hPct: number;
  fundingRate: string;
  volume24h: string;
}

export {
  PLACEHOLDER_FEATURED_MARKET as FEATURED_MARKET,
  PLACEHOLDER_MARKET_ROWS as MARKET_ROWS,
} from '@/lib/data/placeholders/markets';
