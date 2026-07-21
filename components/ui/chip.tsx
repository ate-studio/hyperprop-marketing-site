import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  showDot?: boolean;
}

export function Chip({ className, showDot = false, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 whitespace-nowrap rounded-pill border border-line bg-paper-raised px-3.5 py-1.5 font-mono text-xs tracking-[0.06em]',
        className,
      )}
      {...props}
    >
      {showDot ? (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-circle bg-blueprint"
        />
      ) : null}
      {children}
    </span>
  );
}
