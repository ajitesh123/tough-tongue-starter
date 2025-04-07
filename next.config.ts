import type { NextConfig } from "next";

// Properly formatted Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.clerk.accounts.dev;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  connect-src *;
  font-src 'self';
  frame-src app.toughtongueai.com *.clerk.accounts.dev
`

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\n/g, ''),
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'microphone=(self "https://app.toughtongueai.com"), camera=(self "https://app.toughtongueai.com"), display-capture=(self "https://app.toughtongueai.com")',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
