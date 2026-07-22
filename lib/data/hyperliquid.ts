import { z } from 'zod';

import {
  FETCH_TIMEOUT_MS,
  HYPERLIQUID_INFO_URL,
} from '@/lib/data/config';
import {
  PLACEHOLDER_FEATURED_MARKET,
  PLACEHOLDER_MARKET_ROWS,
} from '@/lib/data/placeholders/markets';
import {
  liveEnvelope,
  placeholderEnvelope,
  type Sourced,
} from '@/lib/data/sourced';
import type { CandlePoint } from '@/lib/market-candles';
import { generatePlaceholderCandles } from '@/lib/market-candles';
import type { MarketRow } from '@/lib/markets';

const UniverseItemSchema = z.object({
  name: z.string(),
  szDecimals: z.number().optional(),
  maxLeverage: z.number().optional(),
});

const AssetCtxSchema = z.object({
  funding: z.string(),
  prevDayPx: z.string(),
  dayNtlVlm: z.string(),
  markPx: z.string(),
});

const MetaAndAssetCtxsSchema = z.tuple([
  z.object({
    universe: z.array(UniverseItemSchema),
  }),
  z.array(AssetCtxSchema),
]);

const CandleSnapshotSchema = z.array(
  z.object({
    o: z.string(),
    c: z.string(),
    h: z.string(),
    l: z.string(),
  }),
);

const DISPLAY_NAMES: Record<string, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  HYPE: 'Hyperliquid',
  XRP: 'Ripple',
  DOGE: 'Dogecoin',
  AVAX: 'Avalanche',
  LINK: 'Chainlink',
  SUI: 'Sui',
  NEAR: 'Near',
  TON: 'Toncoin',
  ARB: 'Arbitrum',
};

export interface MarketsSnapshot {
  rows: MarketRow[];
  featured: MarketRow;
}

async function postHyperliquid<T>(
  body: Record<string, unknown>,
): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(HYPERLIQUID_INFO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function humanizeVolumeUsd(value: number): string {
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    const formatted =
      billions >= 10
        ? Math.round(billions).toString()
        : billions.toFixed(1).replace(/\.0$/, '');
    return `${formatted}B`;
  }

  if (value >= 1_000_000) {
    return `${Math.round(value / 1_000_000)}M`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K`;
  }

  return Math.round(value).toString();
}

function formatFundingRate(hourlyFunding: string): string {
  const pct = Number.parseFloat(hourlyFunding) * 100;
  if (!Number.isFinite(pct)) {
    return '0.0000%';
  }

  return `${pct.toFixed(4)}%`;
}

function mapAssetToRow(name: string, ctx: z.infer<typeof AssetCtxSchema>): MarketRow | null {
  const markPx = Number.parseFloat(ctx.markPx);
  const prevDayPx = Number.parseFloat(ctx.prevDayPx);
  const dayNtlVlm = Number.parseFloat(ctx.dayNtlVlm);

  if (!Number.isFinite(markPx) || !Number.isFinite(prevDayPx) || prevDayPx <= 0) {
    return null;
  }

  const change24hPct = ((markPx / prevDayPx) - 1) * 100;

  return {
    symbol: name,
    name: DISPLAY_NAMES[name] ?? name,
    lastPrice: markPx,
    change24hPct,
    fundingRate: formatFundingRate(ctx.funding),
    volume24h: humanizeVolumeUsd(dayNtlVlm),
  };
}

function mapCandles(candles: z.infer<typeof CandleSnapshotSchema>): CandlePoint[] {
  return candles.slice(-18).map((candle) => ({
    o: Number.parseFloat(candle.o),
    c: Number.parseFloat(candle.c),
    h: Number.parseFloat(candle.h),
    l: Number.parseFloat(candle.l),
  }));
}

export async function fetchHyperliquidMarkets(): Promise<Sourced<MarketsSnapshot> | null> {
  const payload = await postHyperliquid<unknown>({ type: 'metaAndAssetCtxs' });
  const parsed = MetaAndAssetCtxsSchema.safeParse(payload);

  if (!parsed.success) {
    return null;
  }

  const [meta, assetCtxs] = parsed.data;
  const asOf = new Date().toISOString();

  const ranked = meta.universe
    .map((asset, index) => {
      const ctx = assetCtxs[index];
      if (!ctx) {
        return null;
      }

      const row = mapAssetToRow(asset.name, ctx);
      if (!row) {
        return null;
      }

      return {
        row,
        volume: Number.parseFloat(ctx.dayNtlVlm),
      };
    })
    .filter(
      (
        entry,
      ): entry is {
        row: MarketRow;
        volume: number;
      } => entry !== null,
    )
    .sort((left, right) => right.volume - left.volume);

  const rows = ranked.slice(0, 12).map((entry) => entry.row);
  const btcIndex = meta.universe.findIndex((asset) => asset.name === 'BTC');
  const btcCtx = btcIndex >= 0 ? assetCtxs[btcIndex] : undefined;
  const featuredRow = btcCtx ? mapAssetToRow('BTC', btcCtx) : null;
  const featured = featuredRow ?? rows[0];

  if (rows.length === 0 || !featured) {
    return null;
  }

  return liveEnvelope({ rows, featured }, asOf);
}

export async function fetchHyperliquidCandles(
  coin = 'BTC',
): Promise<Sourced<CandlePoint[]> | null> {
  const endTime = Date.now();
  const startTime = endTime - 19 * 60 * 60 * 1000;
  const payload = await postHyperliquid<unknown>({
    type: 'candleSnapshot',
    req: {
      coin,
      interval: '1h',
      startTime,
      endTime,
    },
  });
  const parsed = CandleSnapshotSchema.safeParse(payload);

  if (!parsed.success || parsed.data.length === 0) {
    return null;
  }

  return liveEnvelope(mapCandles(parsed.data), new Date().toISOString());
}

export function getPlaceholderMarkets(): Sourced<MarketsSnapshot> {
  return placeholderEnvelope({
    rows: PLACEHOLDER_MARKET_ROWS,
    featured: PLACEHOLDER_FEATURED_MARKET,
  });
}

export function getPlaceholderCandles(): Sourced<CandlePoint[]> {
  return placeholderEnvelope(generatePlaceholderCandles(0));
}

export async function getMarketsSnapshot(
  mode: 'live' | 'placeholder',
): Promise<Sourced<MarketsSnapshot>> {
  if (mode === 'placeholder') {
    return getPlaceholderMarkets();
  }

  const live = await fetchHyperliquidMarkets();
  return live ?? getPlaceholderMarkets();
}

export async function getFeaturedCandles(
  mode: 'live' | 'placeholder',
): Promise<Sourced<CandlePoint[]>> {
  if (mode === 'placeholder') {
    return getPlaceholderCandles();
  }

  const live = await fetchHyperliquidCandles('BTC');
  return live ?? getPlaceholderCandles();
}
