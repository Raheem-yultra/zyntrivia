import { LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-solid text-on-accent hover:bg-accent-solid-hover active:bg-accent-solid-hover',
  secondary: 'border border-border-input text-text hover:bg-surface-2',
  ghost:
    'px-1! text-text-muted underline-offset-4 decoration-1 hover:text-text hover:underline focus-visible:text-text',
}

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 text-[0.9375rem]',
  lg: 'min-h-12 px-6 text-base',
}

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type LinkProps = CommonProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'className' | 'children'
  >

type NativeButtonProps = CommonProps & { href?: undefined; loading?: boolean } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  >

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return cn(base, variants[variant], sizes[size])
}

export function Button(props: LinkProps | NativeButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, className, children, href, ...rest } = props
    const external = /^https?:\/\//.test(href)
    const classes = cn(buttonClasses(variant, size), className)
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  const { variant, size, className, children, loading = false, type = 'button', ...rest } = props
  return (
    <button
      type={type}
      className={cn(buttonClasses(variant, size), className)}
      aria-busy={loading || undefined}
      disabled={rest.disabled || loading}
      {...rest}
    >
      {loading && <LoaderCircle aria-hidden className="size-4 animate-spin" strokeWidth={2} />}
      {children}
    </button>
  )
}
