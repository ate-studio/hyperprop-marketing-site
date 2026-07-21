import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type EyebrowProps = HTMLAttributes<HTMLSpanElement>;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return <span className={cn('eyebrow', className)} {...props} />;
}
