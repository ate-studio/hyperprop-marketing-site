import type { DataSource } from '@/lib/data/sourced';

function readDataMode(): DataSource {
  const value = process.env.DATA_MODE?.trim().toLowerCase();

  if (value === 'placeholder') {
    return 'placeholder';
  }

  if (value === 'live' || value === undefined || value === '') {
    return 'live';
  }

  return 'live';
}

export const DATA_MODE: DataSource = readDataMode();

export const NORTHBOOK_INDEXER_URL = process.env.NORTHBOOK_INDEXER_URL?.trim() || null;

export const HYPERLIQUID_INFO_URL = 'https://api.hyperliquid.xyz/info';

export const FETCH_TIMEOUT_MS = 3000;

export const PAGE_REVALIDATE_SECONDS = 60;
