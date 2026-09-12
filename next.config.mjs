/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! Peligro: Le decimos a Next que suba la web aunque haya errores de TS
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb", 
    },
  },
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/@swc/helpers/**/*",
      "./node_modules/react/**/*",
      "./node_modules/react-dom/**/*",
      "./generated/prisma/**/*",
      "./node_modules/@prisma/**/*",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lseaoldllobatjpnzpdx.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;