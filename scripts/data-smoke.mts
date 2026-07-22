import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  fetchHyperliquidCandles,
  fetchHyperliquidMarkets,
} from '../lib/data/hyperliquid';
import { fmtPx } from '../lib/format';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const FIXTURES_DIR = path.join(ROOT, 'reference/fixtures');

async function saveFixtures(): Promise<void> {
  const endTime = Date.now();
  const startTime = endTime - 19 * 60 * 60 * 1000;

  const [metaResponse, candleResponse] = await Promise.all([
    fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'metaAndAssetCtxs' }),
    }),
    fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'candleSnapshot',
        req: { coin: 'BTC', interval: '1h', startTime, endTime },
      }),
    }),
  ]);

  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'hyperliquid-metaAndAssetCtxs.json'),
    JSON.stringify(await metaResponse.json(), null, 2),
  );
  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'hyperliquid-candleSnapshot-btc-1h.json'),
    JSON.stringify(await candleResponse.json(), null, 2),
  );
}

async function main(): Promise<void> {
  await saveFixtures();

  const markets = await fetchHyperliquidMarkets();
  const candles = await fetchHyperliquidCandles('BTC');

  if (!markets) {
    console.error('Failed to fetch live Hyperliquid markets');
    process.exit(1);
  }

  if (!candles) {
    console.error('Failed to fetch live Hyperliquid candles');
    process.exit(1);
  }

  console.log(`Markets source: ${markets.source} asOf=${markets.asOf}`);
  console.log('Top mapped rows:');
  markets.data.rows.forEach((row, index) => {
    console.log(
      `${index + 1}. ${row.symbol}-USDC last=$${fmtPx(row.lastPrice)} chg=${row.change24hPct.toFixed(2)}% fund=${row.fundingRate} vol=$${row.volume24h}`,
    );
  });
  console.log(
    `Featured: ${markets.data.featured.symbol}-USDC $${fmtPx(markets.data.featured.lastPrice)}`,
  );
  console.log(`Candle count: ${candles.data.length}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
