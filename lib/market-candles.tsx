import type { ReactElement } from 'react';

type CandlePoint = {
  o: number;
  c: number;
  h: number;
  l: number;
};

function seededRandom(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

function generateCandlePoints(spotIndex: number, count = 18): CandlePoint[] {
  const rnd = seededRandom((spotIndex + 1) * 9973);
  let price = 50;
  const points: CandlePoint[] = [];

  for (let candleIndex = 0; candleIndex < count; candleIndex += 1) {
    const open = price;
    const move = (rnd() - 0.48) * 10;
    const close = open + move;
    const high = Math.max(open, close) + rnd() * 4;
    const low = Math.min(open, close) - rnd() * 4;
    points.push({ o: open, c: close, h: high, l: low });
    price = close;
  }

  return points;
}

export function renderMarketCandles(spotIndex: number): ReactElement[] {
  const candleCount = 18;
  const candleWidth = 260 / candleCount;
  const bodyWidth = candleWidth * 0.52;
  const points = generateCandlePoints(spotIndex, candleCount);
  const highAll = Math.max(...points.map((point) => point.h));
  const lowAll = Math.min(...points.map((point) => point.l));

  const y = (value: number) => 6 + ((highAll - value) / (highAll - lowAll)) * 72;

  return points.flatMap((point, candleIndex) => {
    const x = candleIndex * candleWidth + candleWidth / 2;
    const up = point.c >= point.o;
    const color = up ? 'var(--up)' : 'var(--down)';
    const bodyTop = y(Math.max(point.o, point.c));
    const bodyBottom = y(Math.min(point.o, point.c));
    const bodyHeight = Math.max(bodyBottom - bodyTop, 1.5);

    return [
      <line
        key={`wick-${candleIndex}`}
        x1={x}
        y1={y(point.h)}
        x2={x}
        y2={y(point.l)}
        stroke={color}
        strokeWidth={1}
      />,
      <rect
        key={`body-${candleIndex}`}
        x={x - bodyWidth / 2}
        y={bodyTop}
        width={bodyWidth}
        height={bodyHeight}
        fill={color}
        rx={1}
      />,
    ];
  });
}
