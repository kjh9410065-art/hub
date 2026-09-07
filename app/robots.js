// 검색엔진이 HUB를 크롤링할 수 있도록 robots.txt를 생성합니다.
// 정적 export 환경에서는 이 Route Handler를 빌드 시점에 정적으로 생성하도록 명시합니다.
export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://hub.carpick.workers.dev/sitemap.xml"
  };
}
