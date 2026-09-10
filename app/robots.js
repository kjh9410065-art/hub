// 검색엔진과 주요 AI 크롤러가 HUB의 공개 콘텐츠를 읽을 수 있도록 허용합니다.
// 정적 export 환경에서도 /robots.txt가 항상 동일한 공개 규칙을 반환하도록 force-static을 사용합니다.
export const dynamic = "force-static";

export default function robots() {
  const baseUrl = "https://hub.carpick.workers.dev";

  // 일반 검색엔진과 주요 AI 크롤러를 명시적으로 허용해
  // 크롤러별 robots 해석 차이로 인한 접근 제한을 최소화합니다.
  const aiAndSearchCrawlers = [
    "*",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended"
  ];

  return {
    rules: aiAndSearchCrawlers.map((userAgent) => ({
      userAgent,
      allow: "/"
    })),
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
