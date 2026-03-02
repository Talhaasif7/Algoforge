import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["bcrypt", "jsonwebtoken", "ioredis", "dockerode"],
};

export default nextConfig;
