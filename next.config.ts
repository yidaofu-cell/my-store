import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for build, use webpack instead
  // This avoids workspace root detection issues in monorepo setups
};

export default nextConfig;
