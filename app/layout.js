import "./globals.css";

export const metadata = {
  title: "HUB — 목적에 맞는 AI·개발 서비스 찾기",
  description: "만들고 싶은 목적을 선택하면 필요한 AI·개발 서비스를 빠르게 비교하고 추천받을 수 있습니다.",
  metadataBase: new URL("https://hub.carpick.workers.dev")
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* 개별 SVG 일러스트를 정적 CSS로 연결해 기존 전역 CSS와 분리합니다. */}
        <link rel="stylesheet" href="/illustrations.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
