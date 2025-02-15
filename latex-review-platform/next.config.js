/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // 禁用某些页面的静态生成
    workerThreads: false,
    cpus: 1,
    serverActions: {
      allowedOrigins: ['localhost:3000', 'app:3000'],
    }
  },
  // 添加运行时配置
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 添加主机配置
  hostname: '0.0.0.0',
  port: 3000,
}

module.exports = nextConfig 