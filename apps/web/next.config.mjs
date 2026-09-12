const basePath = process.env.PDE_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的エクスポート: GitHub Pages など任意の静的ホスティングにデプロイ可能
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
