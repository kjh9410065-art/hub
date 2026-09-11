// MOVA의 공개 페이지를 검색엔진이 정상적으로 크롤링할 수 있도록 설정합니다.
export const dynamic = "force-static";

export default function robots() {
  const baseUrl = "https://mova.tcflick.com";
  const crawlers = ["*", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended"];

  return {
    rules: crawlers.map((userAgent) => ({ userAgent, allow: "/" })),
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
