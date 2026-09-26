import { LogoMark } from './LogoMark'

/**
 * Brief full-screen logo on a full page load: the Z draws in, then the screen fades away.
 *
 * CSS only, so it needs no JavaScript and never waits on the network; the timing lives in
 * `animate-splash` and `animate-mark-draw-in` (globals.css). It sits in the root layout,
 * which stays mounted across client-side navigation, so clicking between pages doesn't
 * replay it; only a first visit or a reload does.
 *
 * `aria-hidden`: the page underneath is already in the accessibility tree and readable,
 * so screen-reader users aren't held up by a picture of the logo.
 */
export function SplashScreen() {
  return (
    <div
      aria-hidden
      data-splash
      className="animate-splash fixed inset-0 z-60 grid place-items-center bg-bg"
    >
      <LogoMark animation="draw-in" className="size-16 md:size-20" />
    </div>
  )
}
