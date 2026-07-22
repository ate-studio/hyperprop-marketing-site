import type { Sourced } from '@/lib/data/sourced';

export function formatUtcTime(iso: string | null): string {
  if (!iso) {
    return '--:--';
  }

  return new Date(iso).toISOString().slice(11, 16);
}

export function formatMarketsProvenance(source: Sourced<unknown>['source'], asOf: string | null): string {
  if (source === 'live') {
    return `Live · Hyperliquid · as of ${formatUtcTime(asOf)} UTC · refreshed every 60s`;
  }

  return 'Indicative snapshot · not live data';
}

export function formatIndexerProvenance(source: Sourced<unknown>['source'], asOf: string | null): string {
  if (source === 'live') {
    return `Published live · as of ${formatUtcTime(asOf)} UTC`;
  }

  return 'Indicative figures · pending indexer';
}
