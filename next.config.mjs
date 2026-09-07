// Cloudflare Pages에서 정적 사이트로 배포할 수 있도록 Next.js를 정적 출력으로 설정합니다.
const nextConfig = {
  output: "export",
  images: {
    // 정적 배포에서는 Next.js 이미지 최적화 서버가 없으므로 비활성화합니다.
    unoptimized: true
  }
};

export default nextConfig;