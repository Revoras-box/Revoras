import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/Toast";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Revoras",
    default: "Revoras | The Gilded Groom Experience",
  },
  description: "Skip the wait. Walk in fresh. The digital concierge for elite grooming experiences.",
  keywords: ["barber", "grooming", "booking", "luxury", "haircut", "beard"],
  authors: [{ name: "Revoras" }],
  creator: "Revoras",
  metadataBase: new URL("https://revoras.com"),
  openGraph: {
    title: "Revoras | The Gilded Groom Experience",
    description: "Skip the wait. Walk in fresh. The digital concierge for elite grooming experiences.",
    type: "website",
    siteName: "Revoras",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revoras | The Gilded Groom Experience",
    description: "Skip the wait. Walk in fresh. The digital concierge for elite grooming experiences.",
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
    { media: "(prefers-color-scheme: light)", color: "#F8F9FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0F" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Set the theme class before first paint to avoid a flash of the
            wrong theme (FOUC). Mirrors the logic in ThemeProvider. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`,
          }}
        />
        <link href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700;800;900&family=Manrope:wght@400;500;600&family=Space+Grotesk:wght@400;700&family=Syne:wght@800&display=swap" rel="stylesheet" />
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
