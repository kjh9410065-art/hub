// 검색엔진이 HUB의 기본 주소를 발견할 수 있도록 sitemap.xml을 생성합니다.
// 정적 export 환경에서는 빌드 시점에 sitemap.xml을 생성하도록 명시합니다.
export const dynamic = "force-static";

export default function sitemap() {
  return [{
    url: "https://hub.carpick.workers.dev",
    lastModified: new Date()
  }];
}
