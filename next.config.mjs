/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    remotePatterns: [
      /*{
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL
      },*/
      {
        protocol: "https",
        hostname: "https://firebasestorage.googleapis.com/v0/b/kipi-marketplace.firebasestorage.app"
      },
      {
        protocol: "https",
        hostname: "https://robohash.org"
      },
    ]
  }
};

export default nextConfig;
