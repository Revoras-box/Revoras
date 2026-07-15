/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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

  // Security headers
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
