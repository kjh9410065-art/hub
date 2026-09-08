// 검색엔진이 HUB의 공개 페이지를 크롤링할 수 있도록 정적 robots 규칙을 제공합니다.
// Next.js static export에서는 동적 라우트로 처리되지 않도록 force-static을 명시합니다.
export const dynamic = "force-static";

export default function robots() {
  const baseUrl = "https://hub.carpick.workers.dev";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
