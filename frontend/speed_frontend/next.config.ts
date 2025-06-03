import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites(){
    return[{
      source:'/api/articles/:path*',
      destination: 'http://localhost:8082/api/articles/:path*',
    }];
  },
};

export default nextConfig;
