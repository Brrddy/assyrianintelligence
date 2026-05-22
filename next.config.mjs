/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow mobile devices on the LAN to load dev resources (HMR, chunks).
  // Without this, Next.js 16 blocks cross-origin requests from non-localhost
  // hosts, which makes the page partially load on a phone over Wi-Fi.
  allowedDevOrigins: ["10.0.0.54", "localhost", "127.0.0.1"],
};

export default nextConfig;
