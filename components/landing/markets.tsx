import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Wrap } from '@/components/ui/wrap';
import { formatMarketsProvenance } from '@/lib/data/format-provenance';
import type { MarketsSnapshot } from '@/lib/data/hyperliquid';
import type { Sourced } from '@/lib/data/sourced';
import { fmtPx } from '@/lib/format';
import { renderMarketCandles, type CandlePoint } from '@/lib/market-candles';
import { cn } from '@/lib/utils';

export interface MarketsProps {
  markets: Sourced<MarketsSnapshot>;
  candles: Sourced<CandlePoint[]>;
}

export function Markets({ markets, candles }: MarketsProps) {
  const { rows, featured } = markets.data;
  const featuredRowIndex = rows.findIndex((row) => row.symbol === featured.symbol);

  return (
    <section id="markets" data-qa="markets" className="sec-pad">
      <Wrap>
        <div className="sec-head sec-head-copy rv">
          <Eyebrow>Markets</Eyebrow>
          <h2>
            Trade{' '}
            <span className="h1-rot">
              <em className="rot">Crypto</em>
            </span>
            <br />
            70+ perpetual markets. Open 24/7.
            {/* PENDING: confirm with CTO — "70+" markets claim */}
          </h2>
          <p>
            Crypto never closes and neither do your evaluations — no session
            windows, no overnight rules.
          </p>
        </div>

        <div className="mkt-wrap">
          <div className="mkt-left">
            <div className="mkt-spot">
              <Eyebrow>Featured market</Eyebrow>
              <div className="sp-body">
                <div className="sp-sym">{featured.symbol}-USDC</div>
                <div className="sp-name">
                  {featured.name.toUpperCase()} · 24/7
                </div>
                <div className="sp-px">${fmtPx(featured.lastPrice)}</div>
                <span
                  className={cn(
                    'sp-chg',
                    featured.change24hPct >= 0 ? 'u' : 'd',
                  )}
                >
                  {featured.change24hPct >= 0 ? '+' : ''}
                  {featured.change24hPct.toFixed(2)}%
                </span>
                <svg viewBox="0 0 260 84" aria-hidden="true" id="sp-chart">
                  {renderMarketCandles(candles.data)}
                </svg>
              </div>
            </div>
          </div>

          <div className="mkt-table">
            <div className="mkt-head">
              <span>Market</span>
              <span>Last</span>
              <span>24h</span>
              <span>Funding</span>
              <span>24h Volume</span>
            </div>
            <div>
              {rows.map((row, index) => (
                <div
                  key={row.symbol}
                  className={cn(
                    'mkt-row',
                    'in',
                    index === featuredRowIndex && 'active',
                  )}
                >
                  <span className="sym">
                    {row.symbol}-USDC<small>{row.name}</small>
                  </span>
                  <span className="px">${fmtPx(row.lastPrice)}</span>
                  <span className={cn('chg', row.change24hPct >= 0 ? 'u' : 'd')}>
                    {row.change24hPct >= 0 ? '+' : ''}
                    {row.change24hPct.toFixed(2)}%
                  </span>
                  <span className="fund">{row.fundingRate}</span>
                  <span className="vol">${row.volume24h}</span>
                </div>
              ))}
            </div>
            <div className="mkt-more">
              <span>+56 MORE MARKETS IN THE&nbsp;</span>
              {/* PENDING: confirm with CTO — terminal URL, and "+56" count claim */}
              <a href="#">TERMINAL -&gt;</a>
            </div>
            <p className="mkt-disclaimer">
              {formatMarketsProvenance(markets.source, markets.asOf)}
            </p>
          </div>
        </div>

        <div className="sec-cta rv">
          <Button href="#pricing" variant="primary">
            Start a challenge
          </Button>
        </div>
      </Wrap>
    </section>
  );
}
