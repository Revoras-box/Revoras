import { NextRequest, NextResponse } from "next/server";

/**
 * Content-Security-Policy, generated per request so it can carry a nonce.
 *
 * Lives in `proxy.ts`, not `middleware.ts`: Next 16 deprecated the middleware
 * file convention in favour of `proxy`, which is the same feature under a name
 * that doesn't get confused with Express middleware. The exported function has
 * to be named `proxy` to match.
 *
 * next.config.mjs already sets nosniff / X-Frame-Options / Referrer-Policy,
 * but those are the easy half. CSP is the one that matters here, because this
 * app keeps its auth token in localStorage: any script that runs on the page
 * can read it and impersonate the user for the token's full 7-day life. CSP is
 * what decides which scripts are allowed to run at all, and it is the only
 * control that stands between an injected `<script>` and that token.
 *
 * A nonce rather than 'unsafe-inline': an allowlist containing 'unsafe-inline'
 * permits every inline script on the page, including one an attacker managed
 * to inject, which defeats the point. The nonce is fresh per response, so only
 * markup this render produced carries a valid one. Next.js reads the nonce out
 * of this header and stamps it on the framework's own inline scripts; our one
 * hand-written inline script (the anti-FOUC theme setter in layout.tsx) reads
 * it back from the request headers below.
 *
 * Trade-off worth stating: reading headers in the root layout makes every
 * route dynamically rendered. That costs nothing here - this app has no
 * `generateStaticParams`, no `revalidate`, and every page fetches from the API
 * with a bearer token at request time, so nothing was being statically
 * generated to begin with.
 */

/** The API this app talks to; must be reachable under connect-src or every fetch fails. */
const API_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || "https://api.revoras.tech/api").origin;
  } catch {
    return "https://api.revoras.tech";
  }
})();

const buildCsp = (nonce: string, isDev: boolean) => {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],

    // Razorpay's checkout.js is loaded at runtime by lib/razorpay.ts and pulls
    // further resources from its own domains.
    // 'unsafe-eval' is development-only: the dev server's hot reloading needs
    // it, production never does.
    "script-src": ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", "https:", ...(isDev ? ["'unsafe-eval'"] : [])],

    // 'unsafe-inline' is unavoidable for styles: Tailwind and Next both emit
    // inline style attributes, and a nonce cannot cover those. Far less
    // dangerous than the script equivalent - CSS can't read localStorage.
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],
    "style-src-elem": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],

    "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],

    // Deliberately broad. Business logos, avatars, map tiles and QR codes come
    // from several hosts, some configured by environment (MEDIA_BASE_URL), and
    // an image that fails to load is a visible bug for no security gain: an
    // <img> cannot execute. The directives that actually contain an attacker -
    // script-src, object-src, base-uri, form-action, frame-ancestors - stay strict.
    "img-src": ["'self'", "data:", "blob:", "https:"],

    "connect-src": [
      "'self'",
      API_ORIGIN,
      "https://api.razorpay.com",
      "https://lumberjack.razorpay.com",
      ...(isDev ? ["http://localhost:5000", "ws://localhost:*"] : []),
    ],

    // Razorpay's payment window is an iframe.
    "frame-src": ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],

    // No Flash/Java/embed objects exist here, and they are a classic bypass.
    "object-src": ["'none'"],
    // Stops an injected <base> silently repointing every relative URL on the page.
    "base-uri": ["'self'"],
    // Stops an injected form from posting credentials to somebody else's server.
    "form-action": ["'self'"],
    // Clickjacking: nobody may frame this app. Supersedes X-Frame-Options in modern browsers.
    "frame-ancestors": ["'none'"],
  };

  // Deduplicated because sources arrive from more than one place - a local API
  // origin, for instance, is both API_ORIGIN and a dev-only entry - and a
  // directive listing the same origin twice is just noise in a header people
  // have to read to debug.
  const serialized = Object.entries(directives)
    .map(([key, values]) => `${key} ${[...new Set(values)].join(" ")}`)
    .join("; ");

  /**
   * `upgrade-insecure-requests` rewrites any http:// subresource to https://,
   * which is what you want once everything genuinely is served over TLS.
   *
   * It is deliberately NOT emitted when the configured API is itself http://.
   * Chrome upgrades such requests even for localhost, so every API call would
   * be rewritten to an https:// URL with nothing listening on it, and the
   * request fails with a bare "Failed to fetch" and - because an upgrade is
   * not a violation - no CSP report and nothing in the console to explain it.
   * Verified against a production build talking to an http API: exactly that,
   * silently.
   *
   * An http API origin means this is not an https-everywhere deployment, so
   * upgrading is not protecting anything here; it only breaks the app in a way
   * that is genuinely hard to diagnose. Point NEXT_PUBLIC_API_URL at https and
   * the directive comes back on its own.
   */
  const apiIsHttps = API_ORIGIN.startsWith("https://");
  return isDev || !apiIsHttps ? serialized : `${serialized}; upgrade-insecure-requests`;
};

export function proxy(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";

  // 128 bits from the Web Crypto CSPRNG. A guessable nonce is no nonce at all.
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  const csp = buildCsp(nonce, isDev);

  // Passed down so the root layout can stamp it on its inline theme script.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);

  // Disables the browser APIs this app never uses, so a compromised page can't
  // reach for them either. Geolocation is deliberately absent from the deny
  // list - "near me" search needs it.
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), payment=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()"
  );

  // Severs the window.opener relationship and cross-origin resource embedding,
  // which is what closes off cross-window scripting and Spectre-style leaks.
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");

  // HSTS: only meaningful over HTTPS, and pointless (or actively annoying) on
  // localhost, so it is production-only. No `preload` - that is a one-way door
  // that belongs to whoever owns the domain, not to this file.
  if (!isDev) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Every route except Next's own static output and image optimizer, which
     * are served as-is and gain nothing from these headers. Kept as one negative
     * lookahead so a new page can never be missed by forgetting to list it.
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
