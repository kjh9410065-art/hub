// 검색엔진이 HUB의 기본 주소를 발견할 수 있도록 sitemap.xml을 생성합니다.
export default function sitemap() {
  return [{
    url: "https://hub.carpick.workers.dev",
    lastModified: new Date()
  }];
}
