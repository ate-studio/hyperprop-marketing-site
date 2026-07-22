import type { MarketRow } from '@/lib/markets';
import { cn } from '@/lib/utils';

export interface TickerProps {
  rows: MarketRow[];
}

function toTickerItems(rows: MarketRow[]) {
  return rows.map((row) => ({
    symbol: `${row.symbol}-USDC`,
    changeLabel: `${row.change24hPct >= 0 ? '+' : ''}${row.change24hPct.toFixed(2)}%`,
    direction: row.change24hPct >= 0 ? ('u' as const) : ('d' as const),
  }));
}

function TickerHalf({
  items,
  suffix,
}: {
  items: ReturnType<typeof toTickerItems>;
  suffix: string;
}) {
  return (
    <div className="ticker-half">
      {items.map((item) => (
        <span key={`${item.symbol}-${suffix}`} className="t-item">
          <span>{item.symbol}</span>
          <span className={cn(item.direction)}>{item.changeLabel}</span>
        </span>
      ))}
    </div>
  );
}

export function Ticker({ rows }: TickerProps) {
  const items = toTickerItems(rows);

  return (
    <div className="ticker" aria-hidden="true" data-qa="ticker">
      <div className="ticker-track">
        <TickerHalf items={items} suffix="a" />
        <TickerHalf items={items} suffix="b" />
      </div>
    </div>
  );
}
