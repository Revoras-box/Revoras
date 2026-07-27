/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Dev-only: allow the LAN address to fetch /_next/* (HMR, chunks) so the app
  // is testable from a phone on the same wifi. Ignored by production builds.
  // If DHCP hands this machine a different address, add it here too.
  allowedDevOrigins: ['192.168.31.145'],
  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable compression
  compress: true,

  // Phase 3.3: the Business Dashboard moved from /barbers/* to /business/*
  // (the old paths' data calls hit the removed /api/studios/manage/* prefix
  // anyway). /barbers itself is untouched - it's the public "Master
  // Barbers" marketing page, unrelated to the dashboard.
  async redirects() {
    return [
      { source: "/barbers/dashboard", destination: "/business", permanent: false },
      { source: "/barbers/schedule", destination: "/business/calendar", permanent: false },
      { source: "/barbers/barbers", destination: "/business/professionals", permanent: false },
      { source: "/barbers/services", destination: "/business/services", permanent: false },
      { source: "/barbers/payments", destination: "/business/payments", permanent: false },
      { source: "/barbers/analytics", destination: "/business/analytics", permanent: false },
      { source: "/barbers/settings", destination: "/business/settings", permanent: false },
      { source: "/barbers/walk-in", destination: "/business/appointments", permanent: false },
    ];
  },

  // Static security headers - the ones that are the same on every response.
  //
  // The per-request ones live in src/proxy.ts, because they can't be
  // static: Content-Security-Policy carries a fresh nonce each render, and
  // HSTS must not be sent in development. See that file for the CSP itself,
  // which is what actually constrains an injected script.
  //
  // X-Frame-Options is kept alongside the CSP's stricter `frame-ancestors
  // 'none'` deliberately - it is the only one of the two that older browsers
  // understand, and they do not conflict.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
