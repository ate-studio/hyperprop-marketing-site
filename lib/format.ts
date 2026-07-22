const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const PASS_RATE_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatUsd(amount: number): string {
  return USD_FORMATTER.format(amount);
}

export function formatDuration(minutes: number): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${remainingMinutes}m`;
}

export function formatPassRate(pct: number): string {
  return `${PASS_RATE_FORMATTER.format(pct)}%`;
}

export function fmtPx(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }

  if (value >= 1) {
    return value.toFixed(value >= 100 ? 2 : 4);
  }

  return value.toFixed(8).replace(/0+$/, '').padEnd(3, '0');
}
