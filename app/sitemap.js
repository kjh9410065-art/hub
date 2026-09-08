import { catalog } from "./lib/catalog";
import { guides } from "./guides/data";

// static export 환경에서는 sitemap도 정적 라우트로 명시해야 빌드가 안정적으로 완료됩니다.
export const dynamic = "force-static";

// 공개 페이지, 가이드, 서비스 상세 페이지를 검색엔진에 명확하게 전달합니다.
export default function sitemap() {
  const baseUrl = "https://hub.carpick.workers.dev";
  const staticRoutes = [
    "/",
    "/recommend",
    "/catalog",
    "/compare",
    "/tools",
    "/guides",
    "/privacy",
    "/terms",
    "/contact"
  ];
  const guideRoutes = guides.map((guide) => `/guides/${guide.slug}`);
  const serviceRoutes = catalog.map((service) => `/services/${service.id}`);

  return [...staticRoutes, ...guideRoutes, ...serviceRoutes].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path.startsWith("/guides/") ? 0.85 : path.startsWith("/services/") ? 0.7 : path === "/guides" ? 0.9 : 0.8
  }));
}
