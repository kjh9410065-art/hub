const baseUrl = "https://mova.tcflick.com";

export default function sitemap() {
  // 검색엔진이 우선적으로 확인할 주요 공개 페이지를 sitemap에 등록합니다.
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/catalog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/compare`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/external-links`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.4 }
  ];
}
