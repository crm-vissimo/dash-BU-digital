/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pg'],
  // O servidor lê o código e a lista de fontes do painel em public/dash.
  outputFileTracingIncludes: { '/api/dataset': ['./public/dash/data.js', './public/dash/datasets.json'] },
};
export default nextConfig;
