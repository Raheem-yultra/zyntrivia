import Script from 'next/script'

/** Cookieless analytics. Only loads in production with PLAUSIBLE_DOMAIN set. */
export function PlausibleScript() {
  const domain = process.env.PLAUSIBLE_DOMAIN
  if (process.env.NODE_ENV !== 'production' || !domain) return null

  return (
    <>
      <Script id="plausible-queue" strategy="afterInteractive">
        {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
      </Script>
      <Script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    </>
  )
}
