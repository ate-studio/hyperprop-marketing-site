import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn-primary',
      ghost: 'btn-ghost',
    },
    size: {
      default: '',
      nav: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type SharedButtonProps = ButtonVariantProps & {
  className?: string;
  children?: React.ReactNode;
};

export type ButtonProps = SharedButtonProps &
  (
    | ({ href: string } & Omit<
        ComponentPropsWithoutRef<typeof Link>,
        'className' | 'href' | 'children'
      >)
    | ({ href?: undefined } & Omit<
        ComponentPropsWithoutRef<'button'>,
        'className' | 'children'
      >)
  );

export function Button({
  className,
  variant,
  size,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href !== undefined) {
    const linkProps = props as Omit<
      ComponentPropsWithoutRef<typeof Link>,
      'className' | 'href' | 'children'
    >;

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as Omit<
    ComponentPropsWithoutRef<'button'>,
    'className' | 'children'
  >;

  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

export { buttonVariants };
