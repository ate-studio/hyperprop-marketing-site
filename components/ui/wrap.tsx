import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type WrapProps = HTMLAttributes<HTMLDivElement>;

export function Wrap({ className, ...props }: WrapProps) {
  return <div className={cn('mx-auto max-w-maxw px-7', className)} {...props} />;
}
