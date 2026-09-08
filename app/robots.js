// 검색엔진이 HUB의 공개 페이지를 크롤링할 수 있도록 robots 규칙을 제공합니다.
export default function robots() {
  const baseUrl = "https://hub.carpick.workers.dev";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
