import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/Toast";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Revoras",
    default: "Revoras | Beauty & Wellness, Booked Beautifully",
  },
  description: "Discover and book trusted salons, barbers, spas and beauty professionals near you — all in one place.",
  keywords: ["salon", "barber", "spa", "nails", "beauty", "wellness", "booking", "appointment"],
  authors: [{ name: "Revoras" }],
  creator: "Revoras",
  metadataBase: new URL("https://revoras.com"),
  openGraph: {
    title: "Revoras | Beauty & Wellness, Booked Beautifully",
    description: "Discover and book trusted salons, barbers, spas and beauty professionals near you — all in one place.",
    type: "website",
    siteName: "Revoras",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revoras | Beauty & Wellness, Booked Beautifully",
    description: "Discover and book trusted salons, barbers, spas and beauty professionals near you — all in one place.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0D" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set by src/proxy.ts, which also emits the matching Content-Security-Policy
  // header. Without it the inline script below is blocked by that policy.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Set the theme class before first paint to avoid a flash of the
            wrong theme (FOUC). Mirrors the logic in ThemeProvider. */}
        {/* suppressHydrationWarning is required, not cosmetic: once the browser
            has read a nonce it blanks the attribute in the DOM (HTML spec's
            nonce-hiding, so that a page can't leak its own nonce back out via
            CSS attribute selectors). React then compares its "abc123" against
            the DOM's "" and reports a mismatch on every render. The server
            output is correct and the script does run - there is nothing to fix
            but the warning. */}
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`,
          }}
        />
        <link href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body overflow-x-hidden">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
