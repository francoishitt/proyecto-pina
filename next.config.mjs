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
  // Hostinger crea un artefacto de runtime a partir de los trazados de Next.
  // Forzamos la inclusión completa de @swc/helpers para evitar MODULE_NOT_FOUND.
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/@swc/helpers/**/*",
      "./node_modules/react/**/*",
      "./node_modules/react-dom/**/*",
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