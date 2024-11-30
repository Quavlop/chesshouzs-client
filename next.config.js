/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
    GAME_API_REST_URL: process.env.GAME_API_REST_URL,
    GAME_API_WS_URL: process.env.GAME_API_WS_URL,
    ENVIRONMENT: process.env.ENVIRONMENT,
    GOOGLE_OAUTH_URL: process.env.GOOGLE_OAUTH_URL,
    MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY,
    MIDTRANS_INTERFACE_URL: process.env.MIDTRANS_INTERFACE_URL,
    MIDTRANS_TRANSACTION_TOKEN: process.env.MIDTRANS_TRANSACTION_TOKEN,
  },
  async headers() {
    return [
      {
        source: '/icons/game-character/:path*', // Match all images in the game-character folder
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // Cache for 1 year
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
