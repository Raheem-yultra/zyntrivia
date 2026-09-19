import { Bricolage_Grotesque, JetBrains_Mono, Public_Sans } from 'next/font/google'

// Display: headings only. Variable with optical size + width axes (design §3).
export const displayFont = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  display: 'swap',
  variable: '--font-bricolage',
})

export const bodyFont = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
})

// Code blocks and inline code in blog posts only — never preloaded.
export const codeFont = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-jetbrains-mono',
})

export const fontVariables = [displayFont.variable, bodyFont.variable, codeFont.variable].join(' ')
