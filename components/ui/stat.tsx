import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/ui/eyebrow';
import { cn } from '@/lib/utils';

const DOT_COUNT = 10;

export interface StatProps {
  label: string;
  value: ReactNode;
  filled?: number;
  valueClassName?: string;
  className?: string;
}

export function Stat({
  label,
  value,
  filled,
  valueClassName,
  className,
}: StatProps) {
  const clampedFilled =
    filled === undefined
      ? undefined
      : Math.min(DOT_COUNT, Math.max(0, Math.round(filled)));

  return (
    <div className={cn('stat', className)}>
      <Eyebrow>{label}</Eyebrow>
      <span className={cn('v num', valueClassName)}>{value}</span>
      {clampedFilled !== undefined ? (
        <div
          aria-hidden="true"
          className="dm-row"
          data-fill={clampedFilled}
        >
          {Array.from({ length: DOT_COUNT }, (_, index) => (
            <i key={index} className={index >= clampedFilled ? 'off' : undefined} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
