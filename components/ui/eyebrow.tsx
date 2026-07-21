import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type EyebrowProps = HTMLAttributes<HTMLParagraphElement>;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return <p className={cn('eyebrow', className)} {...props} />;
}
