import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  size?: 'sm' | 'lg'
  /** Border shifts on hover when the tile contains a stretched link. */
  interactive?: boolean
  as?: 'div' | 'article' | 'li'
  children: ReactNode
} & HTMLAttributes<HTMLElement>

export function Tile({
  size = 'sm',
  interactive = false,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: Props) {
  return (
    <Tag
      className={cn(
        'relative rounded-lg border border-border-subtle bg-surface-1',
        size === 'lg' ? 'p-6 md:p-8' : 'p-5 md:p-6',
        interactive &&
          'transition-colors duration-150 hover:border-border-input has-[a:focus-visible]:border-border-input',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Makes the whole parent Tile clickable while keeping one accessible link. */
export const stretchedLink = 'after:absolute after:inset-0 after:rounded-lg after:content-[""]'
