import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src', 'app', 'components', 'lib', 'utils'] // adjust these directories based on your project structure
  }
}

export default nextConfig
