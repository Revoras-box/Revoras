import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
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
  themeColor: "#131313",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700;800;900&family=Manrope:wght@400;500;600&family=Space+Grotesk:wght@400;700&family=Syne:wght@800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface font-body selection:bg-primary/30 selection:text-primary overflow-x-hidden">
        <Providers>
          {children}
        </Providers>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#0b0b0b',
              border: '1px solid rgba(200, 169, 110, 0.2)',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
