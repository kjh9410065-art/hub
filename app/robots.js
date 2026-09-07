// 검색엔진이 HUB를 크롤링할 수 있도록 robots.txt를 생성합니다.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://hub.carpick.workers.dev/sitemap.xml"
  };
}
